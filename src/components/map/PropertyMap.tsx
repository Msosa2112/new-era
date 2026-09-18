import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './PropertyMap.css';
import { Property } from '../../types/property';
import { Layers, Crosshair, ZoomIn, ZoomOut, Globe, Map as MapIcon } from 'lucide-react';

type MapLayerStyle = 'satellite-hybrid' | 'streets' | 'architectural';

interface PropertyMapProps {
  properties: Property[];
  selectedProperty: Property | null;
  hoveredPropertyId?: string | null;
  onSelectProperty: (property: Property) => void;
  onOpenDetail?: (property: Property) => void;
  onHoverProperty?: (propertyId: string | null) => void;
  lang: 'en' | 'es';
}

// Center around Greater Louisville, KY
const LOUISVILLE_CENTER: [number, number] = [38.2527, -85.6585];
const DEFAULT_ZOOM = 12;

// Format price into compact pill label: e.g. $1.48M, $895K
function formatPricePill(price: number): string {
  if (price >= 1000000) {
    const millions = price / 1000000;
    return `$${millions.toFixed(millions % 1 === 0 ? 0 : 2).replace(/\.00$/, '')}M`;
  }
  if (price >= 1000) {
    return `$${Math.round(price / 1000)}K`;
  }
  return `$${price}`;
}

export const PropertyMap: React.FC<PropertyMapProps> = ({
  properties,
  selectedProperty,
  hoveredPropertyId,
  onSelectProperty,
  onOpenDetail,
  onHoverProperty,
  lang
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<Map<string, L.Marker>>(new Map());
  const tileLayersRef = useRef<L.Layer[]>([]);
  const [mapStyle, setMapStyle] = useState<MapLayerStyle>('satellite-hybrid');

  // Helper to mount active tile layers cleanly
  const applyTileLayers = (map: L.Map, style: MapLayerStyle) => {
    tileLayersRef.current.forEach((layer) => {
      try {
        if (map.hasLayer(layer)) {
          map.removeLayer(layer);
        }
      } catch {
        // Ignore unmount error if already detached
      }
    });
    tileLayersRef.current = [];

    if (style === 'satellite-hybrid') {
      const satLayer = L.tileLayer(
        'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        {
          attribution: 'Esri, Maxar, Earthstar Geographics',
          maxZoom: 19
        }
      );
      const labelsLayer = L.tileLayer(
        'https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}',
        {
          attribution: 'Esri',
          maxZoom: 19
        }
      );
      satLayer.addTo(map);
      labelsLayer.addTo(map);
      tileLayersRef.current = [satLayer, labelsLayer];
    } else if (style === 'streets') {
      const streetsLayer = L.tileLayer(
        'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
        {
          attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
          subdomains: 'abcd',
          maxZoom: 19
        }
      );
      streetsLayer.addTo(map);
      tileLayersRef.current = [streetsLayer];
    } else if (style === 'architectural') {
      const lightLayer = L.tileLayer(
        'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
        {
          attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
          subdomains: 'abcd',
          maxZoom: 19
        }
      );
      lightLayer.addTo(map);
      tileLayersRef.current = [lightLayer];
    }
  };

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: LOUISVILLE_CENTER,
      zoom: DEFAULT_ZOOM,
      zoomControl: false, // We use custom styled controls
      attributionControl: false
    });

    mapInstanceRef.current = map;
    applyTileLayers(map, mapStyle);

    // Invalidate size on resize or transition
    const resizeObserver = new ResizeObserver(() => {
      map.invalidateSize();
    });
    resizeObserver.observe(mapContainerRef.current);

    return () => {
      resizeObserver.disconnect();
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Handle Tile Style Switching
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    applyTileLayers(mapInstanceRef.current, mapStyle);
  }, [mapStyle]);

  // Update Markers when properties list changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Clear existing markers
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current.clear();

    const bounds = L.latLngBounds([]);

    properties.forEach((prop) => {
      const lat = prop.location.latitude;
      const lng = prop.location.longitude;
      if (!lat || !lng) return;

      const isSelected = selectedProperty?.id === prop.id;
      const isHovered = hoveredPropertyId === prop.id;
      const pillText = formatPricePill(prop.price);

      const customIcon = L.divIcon({
        className: 'custom-price-marker',
        html: `<div id="marker-pill-${prop.id}" class="map-price-pill ${isSelected ? 'is-active' : ''} ${isHovered ? 'is-hovered' : ''}">${pillText}</div>`,
        iconSize: [68, 30],
        iconAnchor: [34, 34],
        popupAnchor: [0, -32]
      });

      const marker = L.marker([lat, lng], { icon: customIcon });

      // Build Rich HTML Popup
      const primaryPhoto = prop.media.find(m => m.isPrimary)?.url || prop.media[0]?.url || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80';
      const formattedFullPrice = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 0
      }).format(prop.price);

      const popupHtml = `
        <div class="map-popup-card" id="popup-card-${prop.id}">
          <div class="map-popup-img-wrap">
            <img class="map-popup-img" src="${primaryPhoto}" alt="${prop.title}" />
            <span class="map-popup-status">${prop.status}</span>
            <div class="map-popup-price">${formattedFullPrice}</div>
          </div>
          <div class="map-popup-info">
            <h4 class="map-popup-title">${prop.title}</h4>
            <div class="map-popup-location">${prop.location.address}, ${prop.location.city}</div>
            <div class="map-popup-specs">
              <span><strong>${prop.bedrooms}</strong> ${lang === 'es' ? 'Hab' : 'Beds'}</span>
              <span>&bull;</span>
              <span><strong>${prop.bathrooms}</strong> ${lang === 'es' ? 'Baños' : 'Baths'}</span>
              <span>&bull;</span>
              <span><strong>${new Intl.NumberFormat('en-US').format(prop.sqft)}</strong> Sq Ft</span>
            </div>
            <button class="map-popup-btn" id="btn-view-popup-${prop.id}">
              <span>${lang === 'es' ? 'Ver Detalles' : 'View Property'}</span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M7 17L17 7M17 7H7M17 7V17"/></svg>
            </button>
          </div>
        </div>
      `;

      marker.bindPopup(popupHtml, {
        maxWidth: 290,
        minWidth: 260,
        closeButton: true,
        autoPan: true,
        autoPanPadding: [40, 40]
      });

      marker.on('popupopen', () => {
        onSelectProperty(prop);
        const btn = document.getElementById(`btn-view-popup-${prop.id}`);
        if (btn) {
          btn.onclick = (e) => {
            e.stopPropagation();
            if (onOpenDetail) {
              onOpenDetail(prop);
            } else {
              onSelectProperty(prop);
            }
          };
        }
        const card = document.getElementById(`popup-card-${prop.id}`);
        if (card) {
          card.onclick = () => {
            if (onOpenDetail) {
              onOpenDetail(prop);
            } else {
              onSelectProperty(prop);
            }
          };
        }
      });

      marker.on('mouseover', () => {
        if (onHoverProperty) onHoverProperty(prop.id);
        const el = document.getElementById(`marker-pill-${prop.id}`);
        if (el) el.classList.add('is-hovered');
      });

      marker.on('mouseout', () => {
        if (onHoverProperty) onHoverProperty(null);
        const el = document.getElementById(`marker-pill-${prop.id}`);
        if (el && selectedProperty?.id !== prop.id) el.classList.remove('is-hovered');
      });

      marker.on('click', () => {
        onSelectProperty(prop);
        map.panTo([lat, lng], { animate: true, duration: 0.5 });
      });

      marker.addTo(map);
      markersRef.current.set(prop.id, marker);
      bounds.extend([lat, lng]);
    });

    // If properties exist and bounds are valid, auto-fit gracefully
    if (properties.length > 0 && bounds.isValid()) {
      map.fitBounds(bounds, { padding: [60, 60], maxZoom: 14 });
    }
  }, [properties, lang]);

  // Update hover and selected states dynamically on pills without re-rendering map
  useEffect(() => {
    properties.forEach((prop) => {
      const el = document.getElementById(`marker-pill-${prop.id}`);
      if (!el) return;

      if (selectedProperty?.id === prop.id) {
        el.classList.add('is-active');
      } else {
        el.classList.remove('is-active');
      }

      if (hoveredPropertyId === prop.id) {
        el.classList.add('is-hovered');
      } else if (selectedProperty?.id !== prop.id) {
        el.classList.remove('is-hovered');
      }
    });

    // If selectedProperty changes, smoothly open its popup and center map
    if (selectedProperty) {
      const marker = markersRef.current.get(selectedProperty.id);
      if (marker && mapInstanceRef.current) {
        if (!marker.isPopupOpen()) {
          marker.openPopup();
        }
        const latLng = marker.getLatLng();
        mapInstanceRef.current.panTo(latLng, { animate: true, duration: 0.5 });
      }
    }
  }, [selectedProperty, hoveredPropertyId, properties]);

  // Controls Handlers
  const handleZoomIn = () => {
    if (mapInstanceRef.current) mapInstanceRef.current.zoomIn();
  };

  const handleZoomOut = () => {
    if (mapInstanceRef.current) mapInstanceRef.current.zoomOut();
  };

  const handleRecenter = () => {
    if (!mapInstanceRef.current) return;
    const bounds = L.latLngBounds([]);
    properties.forEach((p) => {
      if (p.location.latitude && p.location.longitude) {
        bounds.extend([p.location.latitude, p.location.longitude]);
      }
    });

    if (bounds.isValid()) {
      mapInstanceRef.current.fitBounds(bounds, { padding: [50, 50], maxZoom: 14 });
    } else {
      mapInstanceRef.current.setView(LOUISVILLE_CENTER, DEFAULT_ZOOM);
    }
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
      {/* Leaflet DOM Anchor */}
      <div ref={mapContainerRef} className="luxury-leaflet-container" />

      {/* Floating Modern Luxury Controls */}
      <div className="map-custom-controls" style={{ top: '16px', right: '16px', alignItems: 'flex-end' }}>
        {/* Google Maps & Architectural Layer Switcher Pill */}
        <div
          style={{
            display: 'flex',
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            borderRadius: '8px',
            padding: '3px',
            border: '1px solid rgba(0, 0, 0, 0.12)',
            boxShadow: '0 4px 14px rgba(0, 0, 0, 0.1)',
            gap: '2px'
          }}
        >
          <button
            type="button"
            onClick={() => setMapStyle('satellite-hybrid')}
            style={{
              padding: '6px 10px',
              borderRadius: '6px',
              border: 'none',
              cursor: 'pointer',
              fontSize: '11px',
              fontWeight: 700,
              backgroundColor: mapStyle === 'satellite-hybrid' ? 'var(--color-burgundy-primary, #660E1A)' : 'transparent',
              color: mapStyle === 'satellite-hybrid' ? '#FFFFFF' : '#272C35',
              transition: 'all 160ms ease',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
            title={lang === 'es' ? 'Vista Satelital de Alta Definición' : 'High-Definition Satellite Imagery'}
          >
            <Globe size={13} />
            <span>{lang === 'es' ? 'Satélite HD' : 'Satellite HD'}</span>
          </button>

          <button
            type="button"
            onClick={() => setMapStyle('streets')}
            style={{
              padding: '6px 10px',
              borderRadius: '6px',
              border: 'none',
              cursor: 'pointer',
              fontSize: '11px',
              fontWeight: 700,
              backgroundColor: mapStyle === 'streets' ? 'var(--color-burgundy-primary, #660E1A)' : 'transparent',
              color: mapStyle === 'streets' ? '#FFFFFF' : '#272C35',
              transition: 'all 160ms ease',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
            title={lang === 'es' ? 'Mapa Detallado de Calles' : 'Detailed Streets Map'}
          >
            <MapIcon size={13} />
            <span>{lang === 'es' ? 'Calles' : 'Streets'}</span>
          </button>

          <button
            type="button"
            onClick={() => setMapStyle('architectural')}
            style={{
              padding: '6px 10px',
              borderRadius: '6px',
              border: 'none',
              cursor: 'pointer',
              fontSize: '11px',
              fontWeight: 700,
              backgroundColor: mapStyle === 'architectural' ? 'var(--color-burgundy-primary, #660E1A)' : 'transparent',
              color: mapStyle === 'architectural' ? '#FFFFFF' : '#272C35',
              transition: 'all 160ms ease',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
            title={lang === 'es' ? 'Vista Arquitectónica Clara' : 'Architectural Minimal Light View'}
          >
            <Layers size={13} />
            <span>{lang === 'es' ? 'Claro' : 'Light'}</span>
          </button>
        </div>

        {/* Recenter All */}
        <button
          id="btn-recenter-map"
          type="button"
          onClick={handleRecenter}
          className="map-control-btn"
          title={lang === 'es' ? 'Re-centrar Louisville' : 'Recenter Properties'}
        >
          <Crosshair size={14} />
          <span>{lang === 'es' ? 'Centrar' : 'Center'}</span>
        </button>
      </div>

      {/* Zoom Controls */}
      <div className="map-custom-controls" style={{ bottom: '24px', right: '16px' }}>
        <button
          type="button"
          onClick={handleZoomIn}
          className="map-control-btn"
          style={{ width: '36px', height: '36px', padding: 0 }}
          title="Zoom In"
        >
          <ZoomIn size={16} />
        </button>
        <button
          type="button"
          onClick={handleZoomOut}
          className="map-control-btn"
          style={{ width: '36px', height: '36px', padding: 0 }}
          title="Zoom Out"
        >
          <ZoomOut size={16} />
        </button>
      </div>
    </div>
  );
};
