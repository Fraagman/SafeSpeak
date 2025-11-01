/**
 * Geographic location utilities
 * @module geo
 */

export type Coords = {
  lat: number;
  lng: number;
  accuracy?: number;
};

const STORAGE_KEY = 'userLocation';

// City coordinates map (normalized to lowercase, no spaces)
const CITY_MAP: Record<string, Coords> = {
  delhi: { lat: 28.6139, lng: 77.2090 },
  mumbai: { lat: 19.0760, lng: 72.8777 },
  chennai: { lat: 13.0827, lng: 80.2707 },
  hyderabad: { lat: 17.3850, lng: 78.4867 },
  // Add more cities as needed
};

/**
 * Get the user's current location using the Geolocation API
 * @param opts Options including timeout in milliseconds (default: 15000)
 * @returns Promise resolving to coordinates or null if denied/error
 */
export async function getUserLocation(
  opts: { timeoutMs?: number } = {}
): Promise<Coords | null> {
  if (typeof window === 'undefined' || !navigator?.geolocation) {
    return null;
  }

  try {
    // Check permission state
    const permission = await navigator.permissions.query({
      name: 'geolocation' as any, // Using 'as any' because the type is not in the standard yet
    });

    if (permission.state === 'denied') {
      return null;
    }

    // If permission is granted or prompt, try to get location
    return new Promise((resolve) => {
      const timeout = opts.timeoutMs ?? 15000;
      const options: PositionOptions = {
        enableHighAccuracy: true,
        timeout,
        maximumAge: 0, // Force fresh location
      };

      const timer = setTimeout(() => {
        resolve(null);
      }, timeout);

      navigator.geolocation.getCurrentPosition(
        (pos) => {
          clearTimeout(timer);
          const { latitude: lat, longitude: lng, accuracy } = pos.coords;
          const coords: Coords = { lat, lng, accuracy };
          saveUserLocation(coords);
          resolve(coords);
        },
        () => {
          clearTimeout(timer);
          resolve(null);
        },
        options
      );
    });
  } catch (error) {
    console.error('Error getting location:', error);
    return null;
  }
}

/**
 * Calculate the Haversine distance between two coordinates in kilometers
 * @param a First coordinate
 * @param b Second coordinate
 * @returns Distance in kilometers, rounded to 1 decimal place
 */
export function haversineKm(a: Coords, b: Coords): number {
  const R = 6371; // Earth's radius in km
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);

  const x =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLng / 2) * Math.sin(dLng / 2) * Math.cos(lat1) * Math.cos(lat2);
  const c = 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
  const distance = R * c;
  
  // Round to 1 decimal place
  return Math.round(distance * 10) / 10;
}

/**
 * Format distance in a user-friendly way
 * @param km Distance in kilometers
 * @returns Formatted distance string
 */
export function formatDistance(km: number): string {
  return km < 1 ? '< 1 km' : `${km.toFixed(1)} km`;
}

/**
 * Round coordinates to specified decimal places for privacy
 * @param c Coordinates to round
 * @param decimals Number of decimal places (default: 3 = ~110m precision)
 * @returns Rounded coordinates
 */
export function roundCoords(c: Coords, decimals: number = 3): Coords {
  const factor = Math.pow(10, decimals);
  return {
    lat: Math.round(c.lat * factor) / factor,
    lng: Math.round(c.lng * factor) / factor,
    accuracy: c.accuracy,
  };
}

/**
 * Save user location to localStorage (rounded for privacy by default)
 * @param c Coordinates to save
 * @param opts Options including precise flag to skip rounding
 */
export function saveUserLocation(c: Coords, opts?: { precise?: boolean }): void {
  if (typeof window === 'undefined') return;
  try {
    const toSave = opts?.precise ? c : roundCoords(c);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  } catch (error) {
    console.error('Error saving location to localStorage:', error);
  }
}

/**
 * Load user location from localStorage
 * @returns Saved coordinates or null if not found/invalid
 */
export function loadUserLocation(): Coords | null {
  if (typeof window === 'undefined') return null;
  
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return null;
    
    const coords = JSON.parse(data) as Partial<Coords>;
    if (typeof coords?.lat === 'number' && typeof coords?.lng === 'number') {
      return {
        lat: coords.lat,
        lng: coords.lng,
        accuracy: typeof coords.accuracy === 'number' ? coords.accuracy : undefined,
      };
    }
  } catch (error) {
    console.error('Error loading location from localStorage:', error);
  }
  
  return null;
}

/**
 * Get coordinates for a city name (case-insensitive, ignores spaces)
 * @param input City name
 * @returns Coordinates or null if city not found
 */
export function coordsFromCity(input: string): Coords | null {
  if (!input) return null;
  
  // Normalize: lowercase and remove all spaces
  const normalized = input.toLowerCase().replace(/\s+/g, '');
  return CITY_MAP[normalized] || null;
}

/**
 * Geocode a city name using Nominatim API (best-effort, respects usage policy)
 * @param query City name to geocode
 * @returns Coordinates or null if not found
 */
export async function geocodeCity(query: string): Promise<Coords | null> {
  if (!query || typeof window === 'undefined') return null;
  
  try {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`;
    const response = await fetch(url, {
      headers: {
        'Accept-Language': 'en',
        'User-Agent': 'SafeSpeak/1.0', // Nominatim requires a user agent
      },
    });
    
    if (!response.ok) return null;
    
    const results = await response.json();
    if (!results || results.length === 0) return null;
    
    const hit = results[0];
    return {
      lat: parseFloat(hit.lat),
      lng: parseFloat(hit.lon),
      accuracy: 5000, // Approximate accuracy for geocoded cities
    };
  } catch (error) {
    console.error('Geocoding error:', error);
    return null;
  }
}

// Helper function to convert degrees to radians
function toRad(degrees: number): number {
  return (degrees * Math.PI) / 180;
}
