import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Property } from '../../types/property';
import { Layers, Crosshair, ZoomIn, ZoomOut, Globe, Map as MapIcon, Mountain, Loader2 } from 'lucide-react';
import { loadGoogleMapsScript } from '../../lib/googleMaps';
import './PropertyMap.css';

type GoogleMapStyle = 'hybrid' | 'roadmap' | 'terrain';

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
const LOUISVILLE_CENTER = { lat: 38.2527, lng: -85.6585 };
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

// Build Rich HTML Popup for Desktop InfoWindow
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
  const mapRef = useRef<google.maps.Map | null>(null);
  const infoWindowRef = useRef<google.maps.InfoWindow | null>(null);
  const overlaysRef = useRef<Map<string, any>>(new Map());
  const [mapStyle, setMapStyle] = useState<GoogleMapStyle>('hybrid');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  // Initialize Native Google Maps SDK
  useEffect(() => {
    let isCancelled = false;

    loadGoogleMapsScript()
      .then((googleInstance) => {
        if (isCancelled || !mapContainerRef.current) return;

        // Custom Google Maps Styles to enhance luxury tone
        const luxuryMap = new googleInstance.maps.Map(mapContainerRef.current, {
          center: LOUISVILLE_CENTER,
          zoom: DEFAULT_ZOOM,
          mapTypeId: googleInstance.maps.MapTypeId.HYBRID,
          disableDefaultUI: true, // We use custom styled luxury controls
          gestureHandling: 'greedy', // Smooth navigation on mobile and desktop
          clickableIcons: false, // Prevent distracting third-party POI popups
          tilt: 0,
          maxZoom: 21,
          minZoom: 4
        });

        // Initialize Shared InfoWindow
        const infoWindow = new googleInstance.maps.InfoWindow({
          pixelOffset: new googleInstance.maps.Size(0, -32)
        });

        // Close InfoWindow on background click
        luxuryMap.addListener('click', () => {
          infoWindow.close();
        });

        mapRef.current = luxuryMap;
        infoWindowRef.current = infoWindow;
        setIsLoading(false);
      })
      .catch((err) => {
        console.error('Failed to initialize Google Maps SDK:', err);
        if (!isCancelled) {
          setLoadError(lang === 'es' ? 'No se pudo cargar Google Maps.' : 'Failed to load Google Maps.');
          setIsLoading(false);
        }
      });

    return () => {
      isCancelled = true;
      if (infoWindowRef.current) {
        infoWindowRef.current.close();
        infoWindowRef.current = null;
      }
      overlaysRef.current.forEach((overlay) => overlay.setMap(null));
      overlaysRef.current.clear();
      mapRef.current = null;
    };
  }, []);

  // Update Map Type Style (Hybrid, Roadmap, Terrain)
  useEffect(() => {
    if (!mapRef.current || !window.google?.maps) return;
    const typeId =
      mapStyle === 'hybrid'
        ? window.google.maps.MapTypeId.HYBRID
        : mapStyle === 'roadmap'
        ? window.google.maps.MapTypeId.ROADMAP
        : window.google.maps.MapTypeId.TERRAIN;

    mapRef.current.setMapTypeId(typeId);
  }, [mapStyle]);

  // Create & Sync Custom Overlays (Price Pills) on Google Maps
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !window.google?.maps) return;

    const googleInstance = window.google;

    // Define Custom Price Pill OverlayView Class
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

    // Clear previous overlays
    overlaysRef.current.forEach((overlay) => overlay.setMap(null));
    overlaysRef.current.clear();

    const bounds = new googleInstance.maps.LatLngBounds();
    let hasValidCoords = false;

    properties.forEach((prop) => {
      const lat = prop.location.latitude;
      const lng = prop.location.longitude;
      if (!lat || !lng) return;

      hasValidCoords = true;
      bounds.extend({ lat, lng });

      const overlay = new PricePillOverlay(prop, onSelectProperty, onHoverProperty);
      overlay.setMap(map);
      overlaysRef.current.set(prop.id, overlay);
    });

    if (hasValidCoords && properties.length > 0) {
      map.fitBounds(bounds, {
        top: 60,
        right: 60,
        bottom: 60,
        left: 60
      });

      // Avoid excessive zoom on single property
      const listener = googleInstance.maps.event.addListener(map, 'idle', () => {
        if ((map.getZoom() || 12) > 15) {
          map.setZoom(15);
        }
        googleInstance.maps.event.removeListener(listener);
      });
    }
  }, [properties, onSelectProperty, onHoverProperty, isLoading]);

  // Sync Selected and Hover States
  useEffect(() => {
    overlaysRef.current.forEach((overlay, id) => {
      overlay.setActive(selectedProperty?.id === id);
      overlay.setHover(hoveredPropertyId === id);
    });

    if (selectedProperty && mapRef.current && window.google?.maps) {
      const lat = selectedProperty.location.latitude;
      const lng = selectedProperty.location.longitude;

      if (lat && lng) {
        mapRef.current.panTo({ lat, lng });

        // DESKTOP ONLY: Open rich InfoWindow (on mobile, bottom floating card takes precedence to prevent duplicates)
        if (window.innerWidth > 768 && infoWindowRef.current) {
          const infoWindow = infoWindowRef.current;
          infoWindow.setContent(buildPopupHtml(selectedProperty, lang));
          infoWindow.setPosition({ lat, lng });
          infoWindow.open({ map: mapRef.current });

          // Attach DOM event listeners once InfoWindow is ready
          window.google.maps.event.addListenerOnce(infoWindow, 'domready', () => {
            const btn = document.getElementById(`btn-view-popup-${selectedProperty.id}`);
            if (btn) {
              btn.onclick = (e) => {
                e.stopPropagation();
                if (onOpenDetail) onOpenDetail(selectedProperty);
                else onSelectProperty(selectedProperty);
              };
            }
            const card = document.getElementById(`popup-card-${selectedProperty.id}`);
            if (card) {
              card.onclick = () => {
                if (onOpenDetail) onOpenDetail(selectedProperty);
                else onSelectProperty(selectedProperty);
              };
            }
          });
        } else if (infoWindowRef.current) {
          infoWindowRef.current.close();
        }
      }
    }
  }, [selectedProperty, hoveredPropertyId, lang, onOpenDetail, onSelectProperty]);

  // Controls Handlers
  const handleZoomIn = useCallback(() => {
    if (mapRef.current) {
      mapRef.current.setZoom((mapRef.current.getZoom() || DEFAULT_ZOOM) + 1);
    }
  }, []);

  const handleZoomOut = useCallback(() => {
    if (mapRef.current) {
      mapRef.current.setZoom((mapRef.current.getZoom() || DEFAULT_ZOOM) - 1);
    }
  }, []);

  const handleRecenter = useCallback(() => {
    if (!mapRef.current || !window.google?.maps) return;
    const bounds = new window.google.maps.LatLngBounds();
    let hasCoords = false;

    properties.forEach((p) => {
      if (p.location.latitude && p.location.longitude) {
        bounds.extend({ lat: p.location.latitude, lng: p.location.longitude });
        hasCoords = true;
      }
    });

    if (hasCoords) {
      mapRef.current.fitBounds(bounds, { top: 60, right: 60, bottom: 60, left: 60 });
    } else {
      mapRef.current.setCenter(LOUISVILLE_CENTER);
      mapRef.current.setZoom(DEFAULT_ZOOM);
    }
  }, [properties]);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
      {/* Loading Skeleton */}
      {isLoading && (
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
            {lang === 'es' ? 'Conectando con Google Maps Satélite...' : 'Loading Google Maps Satellite...'}
          </span>
        </div>
      )}

      {/* Error Notice */}
      {loadError && (
        <div
          style={{
            position: 'absolute',
            top: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 100,
            padding: '10px 18px',
            backgroundColor: '#FEF2F2',
            border: '1px solid #F87171',
            borderRadius: '8px',
            color: '#991B1B',
            fontSize: '12px',
            fontWeight: 600
          }}
        >
          {loadError}
        </div>
      )}

      {/* Google Maps Canvas DOM Anchor */}
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
            title={lang === 'es' ? 'Google Satélite HD' : 'Google Satellite HD'}
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
            title={lang === 'es' ? 'Mapa de Calles Google' : 'Google Roadmap'}
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
            title={lang === 'es' ? 'Topografía y Terreno' : 'Terrain'}
          >
            <Mountain size={13} />
            <span>{lang === 'es' ? 'Terreno' : 'Terrain'}</span>
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

      {/* Zoom Controls (Ergonomically positioned above mobile bottom cards) */}
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
