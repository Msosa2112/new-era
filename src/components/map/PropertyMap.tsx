import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Property } from '../../types/property';
import { Layers, Crosshair, ZoomIn, ZoomOut, Globe, Map as MapIcon, Mountain, Loader2 } from 'lucide-react';
import { loadGoogleMapsScript, isGoogleMapsAuthFailed } from '../../lib/googleMaps';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './PropertyMap.css';

type MapViewStyle = 'hybrid' | 'roadmap' | 'terrain';

interface PropertyMapProps {
  properties: Property[];
  selectedProperty: Property | null;
  hoveredPropertyId?: string | null;
  onSelectProperty: (property: Property) => void;
  onOpenDetail?: (property: Property) => void;
  onHoverProperty?: (propertyId: string | null) => void;
  lang: 'en' | 'es';
}

const LOUISVILLE_CENTER: [number, number] = [38.2527, -85.6585];
const DEFAULT_ZOOM = 12;

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

function buildPopupHtml(prop: Property, lang: 'en' | 'es'): string {
  const primaryPhoto =
    prop.media.find((m) => m.isPrimary)?.url ||
    prop.media[0]?.url ||
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80';

  const formattedFullPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(prop.price);

  return `
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
  const [mapStyle, setMapStyle] = useState<MapViewStyle>('hybrid');
  const [engine, setEngine] = useState<'google' | 'leaflet'>(() => {
    return isGoogleMapsAuthFailed() ? 'leaflet' : 'google';
  });
  const [isInitializing, setIsInitializing] = useState<boolean>(true);

  // Google Maps Refs
  const googleMapRef = useRef<google.maps.Map | null>(null);
  const googleInfoWindowRef = useRef<google.maps.InfoWindow | null>(null);
  const googleOverlaysRef = useRef<Map<string, any>>(new Map());

  // Leaflet Refs (Fallback)
  const leafletMapRef = useRef<L.Map | null>(null);
  const leafletMarkersRef = useRef<Map<string, L.Marker>>(new Map());
  const leafletTileLayersRef = useRef<L.Layer[]>([]);

  // Listen for Google Maps auth failures (e.g. RefererNotAllowedMapError on localhost)
  useEffect(() => {
    const handleAuthFailure = () => {
      console.warn('Google Maps auth failure detected. Seamlessly switching to High-Definition Satellite Leaflet engine.');
      if (googleMapRef.current) {
        googleMapRef.current = null;
      }
      if (mapContainerRef.current) {
        mapContainerRef.current.innerHTML = '';
      }
      setEngine('leaflet');
      setIsInitializing(false);
    };

    window.addEventListener('google-maps-auth-failure', handleAuthFailure);
    return () => {
      window.removeEventListener('google-maps-auth-failure', handleAuthFailure);
    };
  }, []);

  // Initialize Map based on Active Engine
  useEffect(() => {
    if (!mapContainerRef.current) return;
    let isCancelled = false;

    if (engine === 'google') {
      loadGoogleMapsScript()
        .then((googleInstance) => {
          if (isCancelled || !mapContainerRef.current) return;

          // Double check if auth failed during script load
          if (isGoogleMapsAuthFailed()) {
            setEngine('leaflet');
            return;
          }

          const map = new googleInstance.maps.Map(mapContainerRef.current, {
            center: { lat: LOUISVILLE_CENTER[0], lng: LOUISVILLE_CENTER[1] },
            zoom: DEFAULT_ZOOM,
            mapTypeId:
              mapStyle === 'hybrid'
                ? googleInstance.maps.MapTypeId.HYBRID
                : mapStyle === 'roadmap'
                ? googleInstance.maps.MapTypeId.ROADMAP
                : googleInstance.maps.MapTypeId.TERRAIN,
            disableDefaultUI: true,
            gestureHandling: 'greedy',
            clickableIcons: false,
            tilt: 0
          });

          const infoWindow = new googleInstance.maps.InfoWindow({
            pixelOffset: new googleInstance.maps.Size(0, -32)
          });

          map.addListener('click', () => {
            infoWindow.close();
          });

          googleMapRef.current = map;
          googleInfoWindowRef.current = infoWindow;
          setIsInitializing(false);
        })
        .catch((err) => {
          console.warn('Google Maps SDK unavailable, using high-definition satellite fallback:', err);
          if (!isCancelled) {
            setEngine('leaflet');
            setIsInitializing(false);
          }
        });
    } else {
      // Initialize Leaflet Map Engine
      if (mapContainerRef.current) {
        mapContainerRef.current.innerHTML = '';
      }

      const map = L.map(mapContainerRef.current, {
        center: LOUISVILLE_CENTER,
        zoom: DEFAULT_ZOOM,
        zoomControl: false,
        attributionControl: false
      });

      leafletMapRef.current = map;
      applyLeafletTiles(map, mapStyle);
      setIsInitializing(false);

      const resizeObserver = new ResizeObserver(() => {
        map.invalidateSize();
      });
      resizeObserver.observe(mapContainerRef.current);

      return () => {
        resizeObserver.disconnect();
        map.remove();
        leafletMapRef.current = null;
      };
    }

    return () => {
      isCancelled = true;
      if (googleInfoWindowRef.current) {
        googleInfoWindowRef.current.close();
        googleInfoWindowRef.current = null;
      }
      googleOverlaysRef.current.forEach((overlay) => overlay.setMap(null));
      googleOverlaysRef.current.clear();
      googleMapRef.current = null;
    };
  }, [engine]);

  // Leaflet Tile Application Helper
  const applyLeafletTiles = (map: L.Map, style: MapViewStyle) => {
    leafletTileLayersRef.current.forEach((layer) => {
      try {
        if (map.hasLayer(layer)) map.removeLayer(layer);
      } catch {}
    });
    leafletTileLayersRef.current = [];

    if (style === 'hybrid') {
      const satLayer = L.tileLayer(
        'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        { attribution: 'Esri, Maxar', maxZoom: 19 }
      );
      const labelsLayer = L.tileLayer(
        'https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}',
        { attribution: 'Esri', maxZoom: 19 }
      );
      satLayer.addTo(map);
      labelsLayer.addTo(map);
      leafletTileLayersRef.current = [satLayer, labelsLayer];
    } else if (style === 'roadmap') {
      const streetsLayer = L.tileLayer(
        'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
        { attribution: 'OpenStreetMap, CARTO', subdomains: 'abcd', maxZoom: 19 }
      );
      streetsLayer.addTo(map);
      leafletTileLayersRef.current = [streetsLayer];
    } else {
      const terrainLayer = L.tileLayer(
        'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
        { attribution: 'OpenStreetMap, CARTO', subdomains: 'abcd', maxZoom: 19 }
      );
      terrainLayer.addTo(map);
      leafletTileLayersRef.current = [terrainLayer];
    }
  };

  // Sync Map Style Changes (Google vs Leaflet)
  useEffect(() => {
    if (engine === 'google' && googleMapRef.current && window.google?.maps) {
      const typeId =
        mapStyle === 'hybrid'
          ? window.google.maps.MapTypeId.HYBRID
          : mapStyle === 'roadmap'
          ? window.google.maps.MapTypeId.ROADMAP
          : window.google.maps.MapTypeId.TERRAIN;
      googleMapRef.current.setMapTypeId(typeId);
    } else if (engine === 'leaflet' && leafletMapRef.current) {
      applyLeafletTiles(leafletMapRef.current, mapStyle);
    }
  }, [mapStyle, engine]);

  // Sync Markers for Google Engine
  useEffect(() => {
    if (engine !== 'google' || !googleMapRef.current || !window.google?.maps) return;
    const map = googleMapRef.current;
    const googleInstance = window.google;

    class PricePillOverlay extends googleInstance.maps.OverlayView {
      private position: google.maps.LatLng;
      private prop: Property;
      private div: HTMLDivElement | null = null;
      private onSelect: (p: Property) => void;
      private onHover?: (id: string | null) => void;

      constructor(
        prop: Property,
        onSelect: (p: Property) => void,
        onHover?: (id: string | null) => void
      ) {
        super();
        this.prop = prop;
        this.position = new googleInstance.maps.LatLng(
          prop.location.latitude!,
          prop.location.longitude!
        );
        this.onSelect = onSelect;
        this.onHover = onHover;
      }

      onAdd() {
        const div = document.createElement('div');
        div.className = 'custom-google-price-marker';
        div.style.position = 'absolute';
        div.style.cursor = 'pointer';
        div.style.zIndex = '100';

        div.innerHTML = `
          <div id="marker-pill-${this.prop.id}" class="map-price-pill">
            ${formatPricePill(this.prop.price)}
          </div>
        `;

        div.addEventListener('click', (e) => {
          e.stopPropagation();
          this.onSelect(this.prop);
        });

        div.addEventListener('mouseenter', () => {
          if (this.onHover) this.onHover(this.prop.id);
          div.querySelector('.map-price-pill')?.classList.add('is-hovered');
          div.style.zIndex = '1000';
        });

        div.addEventListener('mouseleave', () => {
          if (this.onHover) this.onHover(null);
          div.querySelector('.map-price-pill')?.classList.remove('is-hovered');
          div.style.zIndex = '100';
        });

        this.div = div;
        const panes = this.getPanes();
        panes?.overlayMouseTarget.appendChild(div);
      }

      draw() {
        const projection = this.getProjection();
        if (!projection || !this.div) return;
        const point = projection.fromLatLngToDivPixel(this.position);
        if (point) {
          this.div.style.left = `${point.x}px`;
          this.div.style.top = `${point.y}px`;
        }
      }

      onRemove() {
        if (this.div && this.div.parentNode) {
          this.div.parentNode.removeChild(this.div);
          this.div = null;
        }
      }

      setActive(isActive: boolean) {
        if (!this.div) return;
        const pill = this.div.querySelector('.map-price-pill');
        if (isActive) {
          pill?.classList.add('is-active');
          this.div.style.zIndex = '2000';
        } else {
          pill?.classList.remove('is-active');
          this.div.style.zIndex = '100';
        }
      }

      setHover(isHovered: boolean) {
        if (!this.div) return;
        const pill = this.div.querySelector('.map-price-pill');
        if (isHovered) {
          pill?.classList.add('is-hovered');
          this.div.style.zIndex = '1000';
        } else {
          pill?.classList.remove('is-hovered');
        }
      }
    }

    googleOverlaysRef.current.forEach((overlay) => overlay.setMap(null));
    googleOverlaysRef.current.clear();

    const bounds = new googleInstance.maps.LatLngBounds();
    let hasCoords = false;

    properties.forEach((prop) => {
      const lat = prop.location.latitude;
      const lng = prop.location.longitude;
      if (!lat || !lng) return;

      hasCoords = true;
      bounds.extend({ lat, lng });

      const overlay = new PricePillOverlay(prop, onSelectProperty, onHoverProperty);
      overlay.setMap(map);
      googleOverlaysRef.current.set(prop.id, overlay);
    });

    if (hasCoords && properties.length > 0) {
      map.fitBounds(bounds, { top: 60, right: 60, bottom: 60, left: 60 });
    }
  }, [engine, properties, onSelectProperty, onHoverProperty]);

  // Sync Markers for Leaflet Engine
  useEffect(() => {
    if (engine !== 'leaflet' || !leafletMapRef.current) return;
    const map = leafletMapRef.current;

    leafletMarkersRef.current.forEach((marker) => marker.remove());
    leafletMarkersRef.current.clear();

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

      // On desktop only, bind interactive popup
      if (window.innerWidth > 768) {
        marker.bindPopup(buildPopupHtml(prop, lang), {
          maxWidth: 290,
          minWidth: 260,
          closeButton: true,
          autoPan: true
        });

        marker.on('popupopen', () => {
          onSelectProperty(prop);
          const btn = document.getElementById(`btn-view-popup-${prop.id}`);
          if (btn) {
            btn.onclick = (e) => {
              e.stopPropagation();
              if (onOpenDetail) onOpenDetail(prop);
              else onSelectProperty(prop);
            };
          }
          const card = document.getElementById(`popup-card-${prop.id}`);
          if (card) {
            card.onclick = () => {
              if (onOpenDetail) onOpenDetail(prop);
              else onSelectProperty(prop);
            };
          }
        });
      }

      marker.on('click', () => {
        onSelectProperty(prop);
        map.panTo([lat, lng], { animate: true, duration: 0.5 });
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

      marker.addTo(map);
      leafletMarkersRef.current.set(prop.id, marker);
      bounds.extend([lat, lng]);
    });

    if (properties.length > 0 && bounds.isValid()) {
      map.fitBounds(bounds, { padding: [60, 60], maxZoom: 14 });
    }
  }, [engine, properties, lang]);

  // Sync Selected Property (both engines)
  useEffect(() => {
    if (!selectedProperty) return;

    if (engine === 'google' && googleMapRef.current && window.google?.maps) {
      googleOverlaysRef.current.forEach((overlay, id) => {
        overlay.setActive(selectedProperty.id === id);
        overlay.setHover(hoveredPropertyId === id);
      });

      const lat = selectedProperty.location.latitude;
      const lng = selectedProperty.location.longitude;
      if (lat && lng) {
        googleMapRef.current.panTo({ lat, lng });

        if (window.innerWidth > 768 && googleInfoWindowRef.current) {
          const infoWindow = googleInfoWindowRef.current;
          infoWindow.setContent(buildPopupHtml(selectedProperty, lang));
          infoWindow.setPosition({ lat, lng });
          infoWindow.open({ map: googleMapRef.current });

          window.google.maps.event.addListenerOnce(infoWindow, 'domready', () => {
            const btn = document.getElementById(`btn-view-popup-${selectedProperty.id}`);
            if (btn) {
              btn.onclick = (e) => {
                e.stopPropagation();
                if (onOpenDetail) onOpenDetail(selectedProperty);
                else onSelectProperty(selectedProperty);
              };
            }
          });
        }
      }
    } else if (engine === 'leaflet' && leafletMapRef.current) {
      properties.forEach((prop) => {
        const el = document.getElementById(`marker-pill-${prop.id}`);
        if (!el) return;
        if (selectedProperty.id === prop.id) el.classList.add('is-active');
        else el.classList.remove('is-active');

        if (hoveredPropertyId === prop.id) el.classList.add('is-hovered');
        else if (selectedProperty.id !== prop.id) el.classList.remove('is-hovered');
      });

      const marker = leafletMarkersRef.current.get(selectedProperty.id);
      if (marker) {
        if (window.innerWidth > 768 && !marker.isPopupOpen()) {
          marker.openPopup();
        }
        leafletMapRef.current.panTo(marker.getLatLng(), { animate: true, duration: 0.5 });
      }
    }
  }, [selectedProperty, hoveredPropertyId, engine, lang]);

  // Zoom and Recenter Handlers
  const handleZoomIn = useCallback(() => {
    if (engine === 'google' && googleMapRef.current) {
      googleMapRef.current.setZoom((googleMapRef.current.getZoom() || DEFAULT_ZOOM) + 1);
    } else if (engine === 'leaflet' && leafletMapRef.current) {
      leafletMapRef.current.zoomIn();
    }
  }, [engine]);

  const handleZoomOut = useCallback(() => {
    if (engine === 'google' && googleMapRef.current) {
      googleMapRef.current.setZoom((googleMapRef.current.getZoom() || DEFAULT_ZOOM) - 1);
    } else if (engine === 'leaflet' && leafletMapRef.current) {
      leafletMapRef.current.zoomOut();
    }
  }, [engine]);

  const handleRecenter = useCallback(() => {
    if (engine === 'google' && googleMapRef.current && window.google?.maps) {
      const bounds = new window.google.maps.LatLngBounds();
      let hasCoords = false;
      properties.forEach((p) => {
        if (p.location.latitude && p.location.longitude) {
          bounds.extend({ lat: p.location.latitude, lng: p.location.longitude });
          hasCoords = true;
        }
      });
      if (hasCoords) {
        googleMapRef.current.fitBounds(bounds, { top: 60, right: 60, bottom: 60, left: 60 });
      } else {
        googleMapRef.current.setCenter({ lat: LOUISVILLE_CENTER[0], lng: LOUISVILLE_CENTER[1] });
        googleMapRef.current.setZoom(DEFAULT_ZOOM);
      }
    } else if (engine === 'leaflet' && leafletMapRef.current) {
      const bounds = L.latLngBounds([]);
      properties.forEach((p) => {
        if (p.location.latitude && p.location.longitude) {
          bounds.extend([p.location.latitude, p.location.longitude]);
        }
      });
      if (bounds.isValid()) {
        leafletMapRef.current.fitBounds(bounds, { padding: [60, 60], maxZoom: 14 });
      } else {
        leafletMapRef.current.setView(LOUISVILLE_CENTER, DEFAULT_ZOOM);
      }
    }
  }, [engine, properties]);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
      {/* Loading Skeleton */}
      {isInitializing && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 50,
            backgroundColor: '#F4F1EA',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px'
          }}
        >
          <Loader2 size={32} color="var(--color-burgundy-primary, #660E1A)" className="animate-spin" />
          <span style={{ fontSize: '13px', fontWeight: 600, color: '#5A606D' }}>
            {lang === 'es' ? 'Cargando mapa interactivo...' : 'Loading interactive map...'}
          </span>
        </div>
      )}

      {/* Map Canvas DOM Anchor */}
      <div ref={mapContainerRef} className="luxury-leaflet-container" />

      {/* Floating Modern Luxury Controls */}
      <div className="map-custom-controls" style={{ top: '16px', right: '16px', alignItems: 'flex-end' }}>
        {/* Layer Switcher Pill */}
        <div
          style={{
            display: 'flex',
            backgroundColor: 'rgba(255, 255, 255, 0.96)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            borderRadius: '8px',
            padding: '3px',
            border: '1px solid rgba(0, 0, 0, 0.12)',
            boxShadow: '0 4px 14px rgba(0, 0, 0, 0.12)',
            gap: '2px'
          }}
        >
          <button
            type="button"
            onClick={() => setMapStyle('hybrid')}
            style={{
              padding: '6px 10px',
              borderRadius: '6px',
              border: 'none',
              cursor: 'pointer',
              fontSize: '11px',
              fontWeight: 700,
              backgroundColor: mapStyle === 'hybrid' ? 'var(--color-burgundy-primary, #660E1A)' : 'transparent',
              color: mapStyle === 'hybrid' ? '#FFFFFF' : '#272C35',
              transition: 'all 160ms ease',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
            title={lang === 'es' ? 'Vista Satelital de Alta Definición' : 'High-Definition Satellite View'}
          >
            <Globe size={13} />
            <span>{lang === 'es' ? 'Satélite HD' : 'Satellite HD'}</span>
          </button>

          <button
            type="button"
            onClick={() => setMapStyle('roadmap')}
            style={{
              padding: '6px 10px',
              borderRadius: '6px',
              border: 'none',
              cursor: 'pointer',
              fontSize: '11px',
              fontWeight: 700,
              backgroundColor: mapStyle === 'roadmap' ? 'var(--color-burgundy-primary, #660E1A)' : 'transparent',
              color: mapStyle === 'roadmap' ? '#FFFFFF' : '#272C35',
              transition: 'all 160ms ease',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
            title={lang === 'es' ? 'Mapa de Calles' : 'Streets Map'}
          >
            <MapIcon size={13} />
            <span>{lang === 'es' ? 'Calles' : 'Streets'}</span>
          </button>

          <button
            type="button"
            onClick={() => setMapStyle('terrain')}
            style={{
              padding: '6px 10px',
              borderRadius: '6px',
              border: 'none',
              cursor: 'pointer',
              fontSize: '11px',
              fontWeight: 700,
              backgroundColor: mapStyle === 'terrain' ? 'var(--color-burgundy-primary, #660E1A)' : 'transparent',
              color: mapStyle === 'terrain' ? '#FFFFFF' : '#272C35',
              transition: 'all 160ms ease',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
            title={lang === 'es' ? 'Vista Clara' : 'Light View'}
          >
            <Mountain size={13} />
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

      {/* Zoom Controls (Positioned high on mobile to never overlap bottom cards) */}
      <div className="map-zoom-controls-wrapper">
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
