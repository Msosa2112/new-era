import { useEffect, useRef } from 'react';
import { loadGoogleMapsScript, hasGoogleMapsKey } from '../lib/googleMaps';

export interface PlaceResult {
  formattedAddress: string;
  name?: string;
  latitude?: number;
  longitude?: number;
}

interface UseGooglePlacesAutocompleteOptions {
  onPlaceSelected: (place: PlaceResult) => void;
  country?: string;
}

export function useGooglePlacesAutocomplete(
  inputRef: React.RefObject<HTMLInputElement | null>,
  options: UseGooglePlacesAutocompleteOptions
) {
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const listenerRef = useRef<google.maps.MapsEventListener | null>(null);

  useEffect(() => {
    if (!inputRef.current || !hasGoogleMapsKey()) return;

    let isMounted = true;

    loadGoogleMapsScript()
      .then((googleInstance) => {
        if (!isMounted || !inputRef.current) return;

        // Configure Louisville / Kentucky bias bounds
        const louisvilleBounds = new googleInstance.maps.LatLngBounds(
          new googleInstance.maps.LatLng(38.0, -85.95), // Southwest
          new googleInstance.maps.LatLng(38.45, -85.4)  // Northeast
        );

        const autocomplete = new googleInstance.maps.places.Autocomplete(inputRef.current, {
          bounds: louisvilleBounds,
          componentRestrictions: { country: options.country || 'us' },
          fields: ['formatted_address', 'geometry', 'name', 'address_components'],
          strictBounds: false
        });

        autocompleteRef.current = autocomplete;

        const listener = autocomplete.addListener('place_changed', () => {
          const place = autocomplete.getPlace();
          if (!place) return;

          const formattedAddress = place.formatted_address || place.name || '';
          const lat = place.geometry?.location?.lat();
          const lng = place.geometry?.location?.lng();

          options.onPlaceSelected({
            formattedAddress,
            name: place.name,
            latitude: lat,
            longitude: lng
          });
        });

        listenerRef.current = listener;
      })
      .catch((err) => {
        console.warn('Google Places Autocomplete initialization bypassed:', err);
      });

    return () => {
      isMounted = false;
      if (listenerRef.current) {
        google.maps.event.removeListener(listenerRef.current);
        listenerRef.current = null;
      }
      // Remove Google pac-container dropdown artifacts if left in DOM
      const pacContainers = document.querySelectorAll('.pac-container');
      pacContainers.forEach((el) => el.remove());
    };
  }, [inputRef, options.country]);

  return { autocomplete: autocompleteRef.current };
}
