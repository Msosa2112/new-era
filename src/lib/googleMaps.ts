/**
 * Google Maps Platform Integration Utility for New Era Real Estate
 * Handles Places Autocomplete, Official Google Map Tiles, and Street View 360.
 */

let googleMapsPromise: Promise<typeof google> | null = null;
let googleMapsAuthFailed = false;

if (typeof window !== 'undefined') {
  const originalAuth = (window as any).gm_authFailure;
  (window as any).gm_authFailure = () => {
    googleMapsAuthFailed = true;
    window.dispatchEvent(new CustomEvent('google-maps-auth-failure'));
    if (typeof originalAuth === 'function') {
      try { originalAuth(); } catch {}
    }
  };
}

export const isGoogleMapsAuthFailed = (): boolean => googleMapsAuthFailed;

export const getGoogleMapsApiKey = (): string => {
  return import.meta.env.VITE_GOOGLE_MAPS_API_KEY || 'AIzaSyB1HxGEstPbqv5eRXDc97UyixJx3cgHl4U';
};

export const hasGoogleMapsKey = (): boolean => {
  const key = getGoogleMapsApiKey();
  return Boolean(key && key.trim().length > 10 && !googleMapsAuthFailed);
};

/**
 * Dynamically load Google Maps JavaScript API with Places library
 */
export const loadGoogleMapsScript = (): Promise<typeof google> => {
  if (typeof window === 'undefined') {
    return Promise.reject(new Error('Window is not available'));
  }

  if (window.google && window.google.maps && window.google.maps.places && window.google.maps.Map) {
    return Promise.resolve(window.google);
  }

  if (googleMapsPromise) {
    return googleMapsPromise;
  }

  const apiKey = getGoogleMapsApiKey();

  googleMapsPromise = new Promise((resolve, reject) => {
    const callbackName = '__googleMapsInitCallback';
    (window as any)[callbackName] = () => {
      if (window.google && window.google.maps) {
        resolve(window.google);
      } else {
        reject(new Error('Google Maps callback fired without window.google.maps'));
      }
    };

    // Check if script element already exists
    const existingScript = document.getElementById('google-maps-sdk-script');
    if (existingScript) {
      if (window.google && window.google.maps && window.google.maps.Map) {
        resolve(window.google);
        return;
      }
      existingScript.addEventListener('load', () => {
        if (window.google && window.google.maps) resolve(window.google);
        else reject(new Error('Google Maps script loaded without window.google'));
      });
      existingScript.addEventListener('error', () => reject(new Error('Google Maps failed to load')));
      return;
    }

    const script = document.createElement('script');
    script.id = 'google-maps-sdk-script';
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places,geometry&callback=${callbackName}`;
    script.async = true;
    script.defer = true;

    script.onerror = (err) => {
      console.warn('Failed to load Google Maps SDK:', err);
      googleMapsPromise = null;
      reject(err);
    };

    document.head.appendChild(script);
  });

  return googleMapsPromise;
};

/**
 * Google Map Tile URL templates
 */
export const GOOGLE_MAP_TILES = {
  roadmap: {
    url: 'https://mt{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}&key=' + getGoogleMapsApiKey(),
    subdomains: ['0', '1', '2', '3'],
    attribution: '&copy; Google Maps'
  },
  hybrid: {
    url: 'https://mt{s}.google.com/vt/lyrs=y&x={x}&y={y}&z={z}&key=' + getGoogleMapsApiKey(),
    subdomains: ['0', '1', '2', '3'],
    attribution: '&copy; Google Maps Satellite'
  },
  satellite: {
    url: 'https://mt{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}&key=' + getGoogleMapsApiKey(),
    subdomains: ['0', '1', '2', '3'],
    attribution: '&copy; Google Maps Satellite Imagery'
  },
  terrain: {
    url: 'https://mt{s}.google.com/vt/lyrs=p&x={x}&y={y}&z={z}&key=' + getGoogleMapsApiKey(),
    subdomains: ['0', '1', '2', '3'],
    attribution: '&copy; Google Maps Terrain'
  }
};

/**
 * Generate Google Street View Embed URL
 */
export const getStreetViewEmbedUrl = (
  latitude: number,
  longitude: number,
  heading = 180,
  pitch = 5,
  fov = 90
): string => {
  const apiKey = getGoogleMapsApiKey();
  return `https://www.google.com/maps/embed/v1/streetview?key=${apiKey}&location=${latitude},${longitude}&heading=${heading}&pitch=${pitch}&fov=${fov}`;
};
