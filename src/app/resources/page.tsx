"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import dynamic from "next/dynamic";
import LocationToast from "@/components/LocationToast";
import { 
  getUserLocation, 
  loadUserLocation, 
  saveUserLocation, 
  coordsFromCity, 
  geocodeCity,
  haversineKm, 
  formatDistance,
  type Coords 
} from "@/lib/geo";
import { MasonryGrid, type MasonryCardData } from "@/components/ui/masonry-grid-with-scroll-animation";
<<<<<<< HEAD
import InfiniteMenu from "@/components/InfiniteMenu";
import Particles from "@/components/Particles";
=======
>>>>>>> 2c21052ab1a3130dc3d471ecf5c35536dc9b1c56

// Dynamic import for map component (client-only, no SSR)
const ResourcesMap = dynamic(() => import("@/components/ResourcesMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[60vh] rounded-lg bg-gray-100 flex items-center justify-center">
      <p className="text-gray-600">Loading map...</p>
    </div>
  ),
});

// Local storage keys
const STORAGE_KEYS = {
  USER_LOCATION: 'userLocation',
  GEO_PROMPT_SNOOZE: 'geoPromptSnoozeAt'
} as const;

// 24 hours in milliseconds
const SNOOZE_DURATION = 24 * 60 * 60 * 1000;

type ModalState = {
  isOpen: boolean;
  cityInput: string;
  error?: string;
};

type BannerState = {
  isVisible: boolean;
  isLoading: boolean;
  error?: string;
};

type Ngo = {
  id: string;
  name: string;
  services: string[];
  languages: string[];
  verified: boolean;
  contact?: string;
  region?: string;
  state?: string;
  lat: number | null;
  lng: number | null;
  distanceKm?: number;
  approx?: boolean;
};

export default function Resources() {
  const [items, setItems] = useState<Ngo[]>([]);
  const [loading, setLoading] = useState(true);
  const [userLoc, setUserLoc] = useState<Coords | null>(null);
  const [statusMsg, setStatusMsg] = useState<string>("");
  const [radius, setRadius] = useState<number>(Infinity); // Default: Show all
  const [perPage, setPerPage] = useState<number>(Infinity); // Default: Show all
  const [banner, setBanner] = useState<BannerState>({ isVisible: false, isLoading: false });
  const [modal, setModal] = useState<ModalState>({ isOpen: false, cityInput: '' });
  const [permissionState, setPermissionState] = useState<PermissionState | null>(null);
  const [mounted, setMounted] = useState(false);
  const cardRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [geocoding, setGeocoding] = useState(false);
  const [geocodedCity, setGeocodedCity] = useState<{ name: string; coords: Coords } | null>(null);
  const [lastUpdated, setLastUpdated] = useState<number | null>(null);
  const [userCity, setUserCity] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('userCity');
    }
    return null;
  });
  
  // Set user city in state and localStorage
  const setUserCityWithStorage = useCallback((city: string | null) => {
    setUserCity(city);
    if (city) {
      localStorage.setItem('userCity', city);
    } else {
      localStorage.removeItem('userCity');
    }
  }, []);
  
  // Handle Top 5 near me
  const handleTop5NearMe = () => {
    if (!userLoc) {
      setToastMessage('Please set your location first');
      setShowToast(true);
      return;
    }
    setPerPage(5);
    // The useEffect with fetchNgos will trigger automatically
  };
  
  // Handle reset filters
  const handleResetFilters = () => {
    setPerPage(Infinity);
    setRadius(Infinity);
    // The useEffect with fetchNgos will trigger automatically
  };

  // Check if we should show the banner
  const shouldShowBanner = useCallback(() => {
    // Don't show if we have a location
    if (loadUserLocation()) return false;
    
    // Check if user has snoozed the banner
    const snoozeTime = localStorage.getItem(STORAGE_KEYS.GEO_PROMPT_SNOOZE);
    if (snoozeTime) {
      const snoozeUntil = parseInt(snoozeTime, 10);
      if (Date.now() < snoozeUntil) return false;
    }
    
    return true;
  }, []);

  // Check permissions and load location
  useEffect(() => {
    const checkPermissions = async () => {
      try {
        const permission = await navigator.permissions.query({ name: 'geolocation' as any });
        setPermissionState(permission.state);
        
        permission.onchange = () => {
          setPermissionState(permission.state);
        };
      } catch (e) {
        console.warn('Permissions API not supported');
      }
    };

    const savedLoc = loadUserLocation();
    if (savedLoc) {
      setUserLoc(savedLoc);
      setStatusMsg("Using precise location");
      setBanner(prev => ({ ...prev, isVisible: false }));
    } else if (shouldShowBanner()) {
      setBanner({ isVisible: true, isLoading: false });
    }

    setMounted(true);
    checkPermissions();
  }, [shouldShowBanner]);

  // Handle location detection
  const handleLocationRequest = useCallback(async () => {
    setBanner(prev => ({ ...prev, isLoading: true, error: undefined }));
    
    try {
      const location = await getUserLocation({ timeoutMs: 10000 });
      
      if (location) {
        saveUserLocation(location);
        setUserLoc(location);
        setUserCityWithStorage(null); // Clear city when using precise location
        setStatusMsg("Using precise location");
        setBanner(prev => ({ ...prev, isVisible: false }));
        setToastMessage("Location set to approximate area. We only use this to sort nearby NGOs.");
        setShowToast(true);
      } else {
        // Handle denied permission
        if (permissionState === 'denied') {
          setBanner(prev => ({
            ...prev,
            error: 'Location is blocked by the browser. Use the city option instead.'
          }));
        } else {
          setBanner(prev => ({
            ...prev,
            error: 'Could not determine your location. Please try again or enter a city.'
          }));
        }
      }
    } catch (error) {
      console.error('Location error:', error);
      setBanner(prev => ({
        ...prev,
        error: 'Could not determine your location. Please try again or enter a city.'
      }));
    } finally {
      setBanner(prev => ({ ...prev, isLoading: false }));
    }
  }, [permissionState]);

  // Debounced geocoding for city input
  useEffect(() => {
    if (!modal.cityInput || modal.cityInput.length < 3) {
      setGeocodedCity(null);
      return;
    }

    // Check if it's in our predefined list first
    const predefined = coordsFromCity(modal.cityInput);
    if (predefined) {
      setGeocodedCity({ name: modal.cityInput, coords: predefined });
      return;
    }

    // Debounce geocoding API call
    const timer = setTimeout(async () => {
      setGeocoding(true);
      const coords = await geocodeCity(modal.cityInput);
      if (coords) {
        setGeocodedCity({ name: modal.cityInput, coords });
      } else {
        setGeocodedCity(null);
      }
      setGeocoding(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [modal.cityInput]);

  // Handle city submission from modal
  const handleCitySubmit = () => {
    const coords = geocodedCity?.coords || coordsFromCity(modal.cityInput);
    if (coords) {
      const location = { ...coords, accuracy: 1000 }; // Approximate accuracy for city
      saveUserLocation(location);
      setUserLoc(location);
      const cityName = geocodedCity?.name || modal.cityInput;
      setUserCityWithStorage(cityName);
      setStatusMsg(`Using city: ${cityName}`);
      setModal({ isOpen: false, cityInput: '' });
      setBanner(prev => ({ ...prev, isVisible: false }));
      setToastMessage(`Location set to ${cityName}.`);
      setShowToast(true);
      setGeocodedCity(null);
    } else {
      setModal(prev => ({
        ...prev,
        error: 'City not found. Please try another city name.'
      }));
    }
  };

  // Snooze the banner for 24 hours
  const snoozeBanner = () => {
    const snoozeUntil = Date.now() + SNOOZE_DURATION;
    localStorage.setItem(STORAGE_KEYS.GEO_PROMPT_SNOOZE, snoozeUntil.toString());
    setBanner(prev => ({ ...prev, isVisible: false }));
  };

  // Fetch NGOs with offline cache (stale-while-revalidate)
  useEffect(() => {
    const CACHE_KEY = 'resourcesCache';
    const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

    const fetchNgos = async () => {
      setLoading(true);
      try {
        // If we have user location, use the /near endpoint
        if (userLoc) {
          const params = new URLSearchParams({
            lat: userLoc.lat.toString(),
            lng: userLoc.lng.toString(),
            radiusKm: radius === Infinity ? 'all' : radius.toString(),
            limit: perPage === Infinity ? '1000' : perPage.toString(),
            ...(userCity ? { city: userCity } : {})
          });
          
          const url = `/api/resources/near?${params.toString()}`;
          console.log('Fetching from:', url);
          
          const response = await fetch(url, { cache: 'no-store' });
          if (!response.ok) throw new Error('Failed to fetch nearby NGOs');
          
          const data: Ngo[] = await response.json();
          setItems(data);
          setLastUpdated(Date.now());
          return;
        }

        // Fallback to regular endpoint when no location
        // Try to load from cache first
        const cached = localStorage.getItem(CACHE_KEY);
        if (cached) {
          try {
            const { data, fetchedAt } = JSON.parse(cached);
            const age = Date.now() - fetchedAt;
            
            // If cache is fresh, use it immediately
            if (age < CACHE_DURATION) {
              const processed = processNgos(data, userLoc);
              setItems(processed);
              setLastUpdated(fetchedAt);
              setLoading(false);
            }
          } catch (e) {
            console.warn('Cache parse error:', e);
          }
        }

        // Fetch fresh data in background
        const response = await fetch('/api/resources');
        if (!response.ok) throw new Error('Failed to fetch NGOs');
        const data: Ngo[] = await response.json();
        
        // Update cache
        const fetchedAt = Date.now();
        localStorage.setItem(CACHE_KEY, JSON.stringify({ data, fetchedAt }));
        setLastUpdated(fetchedAt);
        
        // Process and sort NGOs
        const processed = processNgos(data, userLoc);
        setItems(processed);
      } catch (error) {
        console.error('Error fetching NGOs:', error);
        setToastMessage('Error loading NGOs. Please try again.');
        setShowToast(true);
      } finally {
        setLoading(false);
      }
    };

    fetchNgos();
  }, [userLoc, radius, perPage, userCity]);

  // Process and sort NGOs based on user location
  const processNgos = (ngos: Ngo[], location: Coords | null): Ngo[] => {
    return ngos
      .map(ngo => {
        // Calculate distance if we have user location and NGO coordinates
        let distance: number | undefined;
        if (location && ngo.lat !== null && ngo.lng !== null) {
          distance = haversineKm(location, { lat: ngo.lat, lng: ngo.lng });
        }
        return { ...ngo, distanceKm: distance };
      })
      .sort((a, b) => {
        // Sort by distance if available, then by verified status, then by name
        if (a.distanceKm !== undefined && b.distanceKm !== undefined) {
          return a.distanceKm - b.distanceKm;
        }
        if (a.verified !== b.verified) {
          return a.verified ? -1 : 1;
        }
        return a.name.localeCompare(b.name);
      });
  };

  const clearLocation = () => {
    setUserLoc(null);
    setUserCityWithStorage(null);
    localStorage.removeItem(STORAGE_KEYS.USER_LOCATION);
    localStorage.removeItem(STORAGE_KEYS.GEO_PROMPT_SNOOZE);
    setStatusMsg("");
    setBanner({ isVisible: shouldShowBanner(), isLoading: false });
    setToastMessage("Location cleared.");
    setShowToast(true);
    setPerPage(Infinity);
    setRadius(Infinity);
  };


  // Filter NGOs by radius
  const filteredItems = items.filter(ngo => {
    if (!Number.isFinite(radius)) return true; // Show all if Infinity
    return ngo.distanceKm === undefined || ngo.distanceKm <= radius;
  });

  // Pagination
  const visibleItems = Number.isFinite(perPage) ? filteredItems.slice(0, perPage) : filteredItems;

  const masonryItems: MasonryCardData[] = visibleItems.map(ngo => ({
    id: ngo.id,
    src: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=500',
    alt: ngo.name,
    content: ngo.services.join(', '),
    linkHref: '#',
    linkText: 'Learn more'
  }));

  // Only render client-side to avoid hydration issues
  if (!mounted) {
    return (
      <main className="w-full max-w-screen-2xl mx-auto p-6">
        <div className="h-8" /> {/* Placeholder for the banner */}
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/2"></div>
          <div className="h-12 bg-gray-100 rounded"></div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 bg-gray-50 rounded-lg"></div>
            ))}
          </div>
        </div>
      </main>
    );
  }

  return (
<<<<<<< HEAD
    <div className="relative min-h-screen">
      {/* Particles Background */}
      <div className="fixed inset-0 z-0 bg-black">
        <Particles
          particleColors={['#ffffff', '#e0e7ff', '#c7d2fe']}
          particleCount={150}
          particleSpread={8}
          speed={0.05}
          particleBaseSize={80}
          sizeRandomness={0.5}
          moveParticlesOnHover={false}
          alphaParticles={true}
          cameraDistance={15}
          disableRotation={false}
        />
      </div>
      
      {/* Main Content */}
      <main className="relative z-10 max-w-4xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="mt-6 flex items-center justify-between rounded-full border border-white/10 px-4 py-2 backdrop-blur max-w-fit">
          <h1 className="font-semibold tracking-tight text-white">Find Help Near You</h1>
=======
    <main className="w-full max-w-screen-2xl mx-auto p-6 space-y-6">
      {/* Location Banner */}
      {banner.isVisible && (
        <div 
          className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 flex flex-col sm:flex-row items-start sm:items-center gap-3"
          role="alert"
          aria-live="polite"
        >
          <div className="flex-1">
            <p className="text-sm text-blue-800">
              Share approximate location to sort nearby help. We only use this to find NGOs near you.
            </p>
            {banner.error && (
              <p className="mt-1 text-sm text-red-600">{banner.error}</p>
            )}
          </div>
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <button
              onClick={handleLocationRequest}
              disabled={banner.isLoading}
              className="px-3 py-1.5 text-sm font-medium bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300 transition-colors"
              aria-label="Use my current location"
            >
              {banner.isLoading ? 'Detecting...' : 'Use my location'}
            </button>
            <button
              onClick={() => setModal({ isOpen: true, cityInput: '' })}
              className="px-3 py-1.5 text-sm font-medium bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
            >
              Enter city
            </button>
            <button
              onClick={snoozeBanner}
              className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800"
              aria-label="Dismiss for 24 hours"
            >
              Not now
            </button>
          </div>
>>>>>>> 2c21052ab1a3130dc3d471ecf5c35536dc9b1c56
        </div>

        {/* Location Banner */}
        {banner.isVisible && (
          <div 
            className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-4 mb-6 flex flex-col sm:flex-row items-start sm:items-center gap-3"
            role="alert"
            aria-live="polite"
          >
            <div className="flex-1">
              <p className="text-sm text-white/80">
                Share approximate location to sort nearby help. We only use this to find NGOs near you.
              </p>
              {banner.error && (
                <p className="mt-1 text-sm text-red-400">{banner.error}</p>
              )}
            </div>
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <button
                onClick={handleLocationRequest}
                disabled={banner.isLoading}
                className="rounded-full bg-white text-black px-4 py-2 font-medium hover:bg-white/90 disabled:bg-white/50 transition-colors"
                aria-label="Use my current location"
              >
                {banner.isLoading ? 'Detecting...' : 'Use my location'}
              </button>
              <button
                onClick={() => setModal({ isOpen: true, cityInput: '' })}
                className="rounded-full border border-white/10 bg-white/10 backdrop-blur px-4 py-2 font-medium text-white hover:bg-white/20 transition-colors"
              >
                Enter city
              </button>
              <button
                onClick={snoozeBanner}
                className="rounded-full border border-white/10 bg-white/10 backdrop-blur px-4 py-2 font-medium text-white/60 hover:bg-white/20 transition-colors"
                aria-label="Dismiss for 24 hours"
              >
                Not now
              </button>
            </div>
          </div>
        )}

        {/* Location Controls */}
        <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <button
              onClick={handleLocationRequest}
              disabled={banner.isLoading}
              className="rounded-full bg-white text-black px-6 py-3 font-medium hover:bg-white/90 disabled:bg-white/50 transition-colors"
              aria-label="Use my current location"
            >
              {banner.isLoading ? 'Detecting...' : 'Use my location'}
            </button>
            
            <div className="text-sm text-white/70 flex-1">
              {statusMsg || 'No location set'}
              {userLoc && (
                <button 
                  onClick={clearLocation}
                  className="ml-2 text-white/60 hover:text-white/80 underline"
                  aria-label="Clear location"
                >
                  (clear)
                </button>
              )}
            </div>
            
            <select
              value={Number.isFinite(radius) ? radius : 'all'}
              onChange={(e) => setRadius(e.target.value === 'all' ? Infinity : Number(e.target.value))}
              className="rounded-full border border-white/10 bg-white/10 backdrop-blur px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-white/20"
              aria-label="Search radius"
            >
              <option value="all" className="bg-gray-900">All</option>
              <option value={5} className="bg-gray-900">5 km</option>
              <option value={10} className="bg-gray-900">10 km</option>
              <option value={25} className="bg-gray-900">25 km</option>
              <option value={50} className="bg-gray-900">50 km</option>
              <option value={100} className="bg-gray-900">100 km</option>
            </select>
          </div>
        </div>

      {/* City Input Modal */}
      {modal.isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          onClick={(e) => e.target === e.currentTarget && setModal(prev => ({ ...prev, isOpen: false }))}
          role="dialog"
          aria-modal="true"
          aria-labelledby="city-modal-title"
        >
          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
            <h2 id="city-modal-title" className="text-xl font-semibold mb-4 text-white">Find help near you</h2>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="city-input" className="block text-sm font-medium text-white/80 mb-1">
                  Enter your city
                </label>
                <input
                  id="city-input"
                  type="text"
                  value={modal.cityInput}
                  onChange={(e) => setModal(prev => ({ ...prev, cityInput: e.target.value, error: undefined }))}
                  placeholder="E.g., Delhi, Mumbai"
                  className="w-full px-3 py-2 rounded-xl border border-white/10 bg-white/10 backdrop-blur text-white placeholder-white/50 text-sm focus:outline-none focus:ring-2 focus:ring-white/20"
                  list="cities"
                  aria-describedby="city-hint"
                />
                <datalist id="cities">
                  {['Delhi', 'Mumbai', 'Chennai', 'Hyderabad'].map(city => (
                    <option key={city} value={city} />
                  ))}
                </datalist>
                <p id="city-hint" className="mt-1 text-xs text-white/60">
                  Suggestions: Delhi, Mumbai, Chennai, Hyderabad, or any city name
                </p>
                {geocoding && (
                  <p className="mt-1 text-xs text-blue-400">Searching...</p>
                )}
                {geocodedCity && (
                  <p className="mt-1 text-xs text-green-400">
                    ✓ Found: {geocodedCity.name}
                  </p>
                )}
                {modal.error && (
                  <p className="mt-1 text-sm text-red-400">{modal.error}</p>
                )}
                <p className="mt-2 text-xs text-white/60 italic">
                  May be approximate; we only store coarse location (~110m precision).
                </p>
              </div>
              
              <div className="flex justify-end gap-3 pt-2">
                <button
                  onClick={() => setModal(prev => ({ ...prev, isOpen: false }))}
                  className="rounded-full border border-white/10 bg-white/10 backdrop-blur px-4 py-2 text-sm font-medium text-white hover:bg-white/20 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCitySubmit}
                  disabled={!modal.cityInput.trim()}
                  className="rounded-full bg-white text-black px-4 py-2 text-sm font-medium hover:bg-white/90 disabled:bg-white/50 transition-colors"
                >
                  Use city
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Results */}
      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white/50 mx-auto"></div>
          <p className="mt-2 text-white/60">Loading resources…</p>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="text-center py-8 rounded-2xl border border-white/10 bg-white/5 backdrop-blur">
          <p className="text-white/60">No NGOs found within {radius} km.</p>
          {radius < 1000 && (
            <button
              onClick={() => setRadius(1000)}
              className="mt-2 text-white/80 hover:text-white underline text-sm"
            >
              Show all NGOs
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {/* Control Bar */}
          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-4 flex flex-wrap items-center gap-3 text-sm">
            <div className="flex items-center gap-2">
              <span className="font-medium text-white/80">Show:</span>
              <select
                value={Number.isFinite(perPage) ? perPage : 'all'}
                onChange={(e) => setPerPage(e.target.value === 'all' ? Infinity : Number(e.target.value))}
                className="rounded-full border border-white/10 bg-white/10 backdrop-blur px-3 py-1 text-sm text-white focus:outline-none focus:ring-2 focus:ring-white/20"
              >
                <option value="all" className="bg-gray-900">All</option>
                <option value={25} className="bg-gray-900">25</option>
                <option value={50} className="bg-gray-900">50</option>
                <option value={100} className="bg-gray-900">100</option>
              </select>
            </div>
            
            <div className="text-white/60">
              Showing <span className="font-semibold text-white">{visibleItems.length}</span> of{' '}
              <span className="font-semibold text-white">{filteredItems.length}</span>
              {filteredItems.length !== items.length && (
                <span> (Total: <span className="font-semibold text-white">{items.length}</span>)</span>
              )}
            </div>
            
            {lastUpdated && (
              <div className="text-xs text-white/60 ml-auto">
                Updated {Math.floor((Date.now() - lastUpdated) / 60000)} min ago
                <button
                  onClick={() => {
                    localStorage.removeItem('resourcesCache');
                    window.location.reload();
                  }}
                  className="ml-2 text-white/80 hover:text-white underline"
                >
                  Clear cache
                </button>
              </div>
            )}
          </div>

          {/* View Toggle and Header */}
          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-6">
            <h2 className="text-2xl font-bold text-white">
              {filteredItems.length} {filteredItems.length === 1 ? 'Resource' : 'Resources'} Found
            </h2>
            {userLoc && (
              <p className="text-sm text-white/60 mt-1">
                Showing results near your location
              </p>
            )}
          </div>

          {/* Top 5 Nearest NGOs with Pin Markers */}
          {userLoc && filteredItems.length > 0 && (
            <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                Top 5 Nearest Resources
              </h3>
              <div className="space-y-3">
                {filteredItems.slice(0, 5).map((ngo, index) => (
                  <div key={ngo.id} className="rounded-xl border border-white/10 bg-white/5 backdrop-blur p-4 hover:bg-white/10 transition-all">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                          {index + 1}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-white truncate">{ngo.name}</h4>
                          {ngo.verified && (
                            <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-emerald-500/20 text-emerald-400 flex-shrink-0">
                              ✓ Verified
                            </span>
                          )}
                        </div>
                        {ngo.distanceKm !== undefined && (
                          <p className="text-sm text-white/60 mb-2">
                            📍 {formatDistance(ngo.distanceKm)} away
                          </p>
                        )}
                        <div className="flex flex-wrap gap-2">
                          {ngo.contact && (
                            <a
                              href={`tel:${ngo.contact}`}
                              className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-blue-400 bg-blue-500/20 rounded-lg hover:bg-blue-500/30 transition-colors"
                            >
                              📞 Call Now
                            </a>
                          )}
                          {ngo.lat && ngo.lng && (
                            <a
                              href={`https://www.google.com/maps/search/?api=1&query=${ngo.lat},${ngo.lng}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-white/80 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
                            >
                              🗺️ Directions
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Interactive Map */}
          {filteredItems.some(ngo => ngo.lat !== null && ngo.lng !== null) && (
            <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M12 1.586l-4 4v12.828l4-4V1.586zM3.707 3.293A1 1 0 002 4v10a1 1 0 00.293.707L6 18.414V5.586L3.707 3.293zM17.707 5.293L14 1.586v12.828l2.293 2.293A1 1 0 0018 16V6a1 1 0 00-.293-.707z" clipRule="evenodd" />
                </svg>
                Interactive Map View
              </h3>
              <ResourcesMap
                ngos={filteredItems
                  .filter(ngo => ngo.lat !== null && ngo.lng !== null)
                  .map(ngo => ({
                    id: ngo.id,
                    name: ngo.name,
                    lat: ngo.lat!,
                    lng: ngo.lng!,
                    verified: ngo.verified,
                    contact: ngo.contact,
                    distanceKm: ngo.distanceKm,
                  }))}
                userLocation={userLoc}
              />
            </div>
          )}

          {/* All Resources List - 3D Infinite Menu */}
          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur overflow-hidden">
            <div style={{ height: '600px', position: 'relative' }}>
              <InfiniteMenu 
                items={filteredItems.map(ngo => ({
                  name: ngo.name,
                  description: ngo.description || 'Help organization providing support',
                  contact: ngo.contact,
                  distanceKm: ngo.distanceKm,
                  verified: ngo.verified
                }))}
              />
            </div>
          </div>
        </div>
      )}

      {/* Location Toast */}
      {showToast && (
        <LocationToast
          message={toastMessage}
          onClear={userLoc ? clearLocation : undefined}
          onDismiss={() => setShowToast(false)}
        />
      )}
    </main>
<<<<<<< HEAD
    </div>
=======
>>>>>>> 2c21052ab1a3130dc3d471ecf5c35536dc9b1c56
  );
}