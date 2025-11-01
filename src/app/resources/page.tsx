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
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const cardRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [geocoding, setGeocoding] = useState(false);
  const [geocodedCity, setGeocodedCity] = useState<{ name: string; coords: Coords } | null>(null);
  const [selectedNgoId, setSelectedNgoId] = useState<string | null>(null);
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

  // Handle marker click - switch to list view and scroll to card
  const handleMarkerClick = (ngoId: string) => {
    setViewMode('list');
    setTimeout(() => {
      const element = cardRefs.current.get(ngoId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        element.classList.add('ring-2', 'ring-blue-500');
        setTimeout(() => {
          element.classList.remove('ring-2', 'ring-blue-500');
        }, 2000);
      }
    }, 100);
  };

  // Filter NGOs by radius
  const filteredItems = items.filter(ngo => {
    if (!Number.isFinite(radius)) return true; // Show all if Infinity
    return ngo.distanceKm === undefined || ngo.distanceKm <= radius;
  });

  // Pagination
  const visibleItems = Number.isFinite(perPage) ? filteredItems.slice(0, perPage) : filteredItems;

  const cities = ["Delhi", "Mumbai", "Chennai", "Hyderabad"];

  // Only render client-side to avoid hydration issues
  if (!mounted) {
    return (
      <main className="max-w-2xl mx-auto p-6">
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
    <main className="max-w-2xl mx-auto p-6 space-y-6">
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
        </div>
      )}

      <div className="space-y-4">
        <h1 className="text-2xl font-bold text-gray-900">Find Help Near You</h1>
        
        {/* Location Controls */}
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <button
              onClick={handleLocationRequest}
              disabled={banner.isLoading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300 transition-colors"
              aria-label="Use my current location"
            >
              {banner.isLoading ? 'Detecting...' : 'Use my location'}
            </button>
            
            <div className="text-sm text-gray-600 flex-1">
              {statusMsg || 'No location set'}
              {userLoc && (
                <button 
                  onClick={clearLocation}
                  className="ml-2 text-blue-600 hover:underline"
                  aria-label="Clear location"
                >
                  (clear)
                </button>
              )}
            </div>
            
            <select
              value={Number.isFinite(radius) ? radius : 'all'}
              onChange={(e) => setRadius(e.target.value === 'all' ? Infinity : Number(e.target.value))}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm"
              aria-label="Search radius"
            >
              <option value="all">All</option>
              <option value={5}>5 km</option>
              <option value={10}>10 km</option>
              <option value={25}>25 km</option>
              <option value={50}>50 km</option>
              <option value={100}>100 km</option>
            </select>
          </div>
        </div>
      </div>

      {/* City Input Modal */}
      {modal.isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={(e) => e.target === e.currentTarget && setModal(prev => ({ ...prev, isOpen: false }))}
          role="dialog"
          aria-modal="true"
          aria-labelledby="city-modal-title"
        >
          <div className="bg-white rounded-lg p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
            <h2 id="city-modal-title" className="text-xl font-semibold mb-4">Find help near you</h2>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="city-input" className="block text-sm font-medium text-gray-700 mb-1">
                  Enter your city
                </label>
                <input
                  id="city-input"
                  type="text"
                  value={modal.cityInput}
                  onChange={(e) => setModal(prev => ({ ...prev, cityInput: e.target.value, error: undefined }))}
                  placeholder="E.g., Delhi, Mumbai"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  list="cities"
                  aria-describedby="city-hint"
                />
                <datalist id="cities">
                  {['Delhi', 'Mumbai', 'Chennai', 'Hyderabad'].map(city => (
                    <option key={city} value={city} />
                  ))}
                </datalist>
                <p id="city-hint" className="mt-1 text-xs text-gray-500">
                  Suggestions: Delhi, Mumbai, Chennai, Hyderabad, or any city name
                </p>
                {geocoding && (
                  <p className="mt-1 text-xs text-blue-600">Searching...</p>
                )}
                {geocodedCity && (
                  <p className="mt-1 text-xs text-green-600">
                    ✓ Found: {geocodedCity.name}
                  </p>
                )}
                {modal.error && (
                  <p className="mt-1 text-sm text-red-600">{modal.error}</p>
                )}
                <p className="mt-2 text-xs text-gray-500 italic">
                  May be approximate; we only store coarse location (~110m precision).
                </p>
              </div>
              
              <div className="flex justify-end gap-3 pt-2">
                <button
                  onClick={() => setModal(prev => ({ ...prev, isOpen: false }))}
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-md border border-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCitySubmit}
                  disabled={!modal.cityInput.trim()}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-blue-300 transition-colors"
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
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading resources…</p>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="text-center py-8 bg-white rounded-lg border border-gray-200">
          <p className="text-gray-600">No NGOs found within {radius} km.</p>
          {radius < 1000 && (
            <button
              onClick={() => setRadius(1000)}
              className="mt-2 text-blue-600 hover:underline text-sm"
            >
              Show all NGOs
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {/* Control Bar */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 flex flex-wrap items-center gap-3 text-sm">
            <div className="flex items-center gap-2">
              <span className="font-medium text-gray-700">Show:</span>
              <select
                value={Number.isFinite(perPage) ? perPage : 'all'}
                onChange={(e) => setPerPage(e.target.value === 'all' ? Infinity : Number(e.target.value))}
                className="px-2 py-1 border border-gray-300 rounded text-sm"
              >
                <option value="all">All</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </div>
            
            <div className="text-gray-600">
              Showing <span className="font-semibold text-gray-900">{visibleItems.length}</span> of{' '}
              <span className="font-semibold text-gray-900">{filteredItems.length}</span>
              {filteredItems.length !== items.length && (
                <span> (Total: <span className="font-semibold text-gray-900">{items.length}</span>)</span>
              )}
            </div>
            
            {lastUpdated && (
              <div className="text-xs text-gray-500 ml-auto">
                Updated {Math.floor((Date.now() - lastUpdated) / 60000)} min ago
                <button
                  onClick={() => {
                    localStorage.removeItem('resourcesCache');
                    window.location.reload();
                  }}
                  className="ml-2 text-blue-600 hover:underline"
                >
                  Clear cache
                </button>
              </div>
            )}
          </div>

          {/* View Toggle and Header */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-800">
                {userLoc ? 'Nearby NGOs' : 'All NGOs'}
                {userLoc && Number.isFinite(radius) && ` (within ${radius} km)`}
              </h2>
            </div>
            
            {/* View Toggle */}
            <div className="inline-flex rounded-md shadow-sm" role="group">
              <button
                type="button"
                onClick={() => setViewMode('list')}
                className={`px-4 py-2 text-sm font-medium rounded-l-lg border ${
                  viewMode === 'list'
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
                aria-label="List view"
              >
                <svg className="w-4 h-4 inline mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
                List
              </button>
              <button
                type="button"
                onClick={() => setViewMode('map')}
                className={`px-4 py-2 text-sm font-medium rounded-r-lg border-t border-r border-b ${
                  viewMode === 'map'
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
                aria-label="Map view"
              >
                <svg className="w-4 h-4 inline mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M12 1.586l-4 4v12.828l4-4V1.586zM3.707 3.293A1 1 0 002 4v10a1 1 0 00.293.707L6 18.414V5.586L3.707 3.293zM17.707 5.293L14 1.586v12.828l2.293 2.293A1 1 0 0018 16V6a1 1 0 00-.293-.707z" clipRule="evenodd" />
                </svg>
                Map
              </button>
            </div>
          </div>

          {/* Map View */}
          {viewMode === 'map' ? (
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
              selectedNgoId={selectedNgoId}
              onMarkerClick={handleMarkerClick}
            />
          ) : (
            /* List View */
            <>
            <div className="space-y-3">
              {visibleItems.map(ngo => (
                <div 
                  key={ngo.id}
                  ref={(el) => {
                    if (el) cardRefs.current.set(ngo.id, el);
                    else cardRefs.current.delete(ngo.id);
                  }}
                  onMouseEnter={() => setSelectedNgoId(ngo.id)}
                  onMouseLeave={() => setSelectedNgoId(null)}
                  onFocus={() => setSelectedNgoId(ngo.id)}
                  onBlur={() => setSelectedNgoId(null)}
                  className="bg-white shadow rounded-lg overflow-hidden hover:shadow-md transition-shadow duration-200"
                >
                  <div className="p-4">
                    <div className="flex justify-between items-start">
                      <h3 className="text-lg font-medium text-gray-900 mb-1">{ngo.name}</h3>
                      <div className="flex items-center space-x-2">
                        {ngo.verified && (
                          <span 
                            className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800" 
                            title="Verified NGO"
                          >
                            ✓ Verified
                          </span>
                        )}
                        {ngo.distanceKm !== undefined && (
                          <span 
                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                              ngo.approx ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'
                            }`}
                            title={ngo.approx ? 'Approximate distance' : 'Distance'}
                          >
                            {ngo.approx ? '≈ ' : ''}{ngo.distanceKm.toFixed(1)} km
                            {ngo.approx && (
                              <span 
                                className="ml-1 cursor-help" 
                                title="Approximate location based on city/region"
                              >
                                ⓘ
                              </span>
                            )}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    {ngo.region && (
                      <p className="text-sm text-gray-500 mb-2">
                        {[ngo.region, ngo.state].filter(Boolean).join(', ')}
                      </p>
                    )}
                    
                    {ngo.services && ngo.services.length > 0 && (
                      <div className="mt-2">
                        <h4 className="text-sm font-medium text-gray-700">Services:</h4>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {ngo.services.slice(0, 3).map((service) => (
                            <span
                              key={service}
                              className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800"
                            >
                              {service}
                            </span>
                          ))}
                          {ngo.services.length > 3 && (
                            <span className="text-xs text-gray-500 self-center">
                              +{ngo.services.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                    
                    {ngo.languages && ngo.languages.length > 0 && (
                      <div className="mt-2">
                        <h4 className="text-sm font-medium text-gray-700">Languages:</h4>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {ngo.languages.slice(0, 3).map((lang) => (
                            <span
                              key={lang}
                              className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800"
                            >
                              {lang}
                            </span>
                          ))}
                          {ngo.languages.length > 3 && (
                            <span className="text-xs text-gray-500 self-center">
                              +{ngo.languages.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                    
                    <div className="mt-3 flex justify-between items-center">
                      {ngo.contact && (
                        <a
                          href={`tel:${ngo.contact}`}
                          className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 hover:underline"
                        >
                          <svg
                            className="h-4 w-4 mr-1 flex-shrink-0"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                            />
                          </svg>
                          {ngo.contact}
                        </a>
                      )}
                      
                      {ngo.lat && ngo.lng && (
                        <a
                          href={`https://www.google.com/maps/search/?api=1&query=${ngo.lat},${ngo.lng}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
                        >
                          <svg
                            className="h-4 w-4 mr-1"
                            fill="none"
                            viewBox="0 0 20 20"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                          </svg>
                          View on Map
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          
          {/* Load More Button */}
          {Number.isFinite(perPage) && visibleItems.length < filteredItems.length && (
            <div className="text-center pt-4">
              <button
                onClick={() => setPerPage(perPage + 25)}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium"
              >
                Load More ({filteredItems.length - visibleItems.length} remaining)
              </button>
            </div>
          )}
          </>
          )}
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
  );
}