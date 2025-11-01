"use client";
import { useParams } from "next/navigation";
import Link from "next/link";
import LocationToast from "@/components/LocationToast";
import { db } from "@/lib/firebase";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import { generateLegalPackPDF, downloadBlob } from "@/lib/legalPack";
import { 
  getUserLocation, 
  loadUserLocation, 
  saveUserLocation, 
  coordsFromCity, 
  haversineKm, 
  formatDistance,
  type Coords 
} from "@/lib/geo";

type NgoWithDistance = {
  id: string;
  name: string;
  contact?: string;
  region?: string;
  lat: number | null;
  lng: number | null;
  verified: boolean;
  distanceKm: number;
};

export default function ReportView() {
  const { id } = useParams() as { id: string };
  const [data, setData] = useState<any>(null);
  const [resources, setResources] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [userLoc, setUserLoc] = useState<Coords | null>(null);
  const [nearest, setNearest] = useState<NgoWithDistance[]>([]);
  const [showLocationInput, setShowLocationInput] = useState(false);
  const [cityInput, setCityInput] = useState("");
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationError, setLocationError] = useState<string>("");
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  useEffect(() => { 
    (async () => {
      try {
        const snap = await getDoc(doc(db, "reports", id)); 
        setData(snap.data());
        
        // Fetch NGOs from API
        const response = await fetch('/api/resources');
        if (response.ok) {
          const ngos = await response.json();
          setResources(ngos);
          
          // Load user location and compute nearest
          const savedLoc = loadUserLocation();
          if (savedLoc) {
            setUserLoc(savedLoc);
            computeNearest(ngos, savedLoc);
          }
        }
      } catch (error) {
        console.error('Error loading report:', error);
      } finally {
        setLoading(false);
      }
    })(); 
  }, [id]);

  const computeNearest = (ngos: any[], location: Coords) => {
    const withDistance = ngos
      .filter(ngo => ngo.lat !== null && ngo.lng !== null)
      .map(ngo => ({
        ...ngo,
        distanceKm: haversineKm(location, { lat: ngo.lat!, lng: ngo.lng! })
      }))
      .sort((a, b) => a.distanceKm - b.distanceKm)
      .slice(0, 3);
    setNearest(withDistance);
  };

  const handleUseMyLocation = async () => {
    setLocationLoading(true);
    setLocationError("");
    try {
      const location = await getUserLocation();
      if (location) {
        saveUserLocation(location);
        setUserLoc(location);
        computeNearest(resources, location);
        setShowLocationInput(false);
        setToastMessage("Location set to approximate area. We only use this to sort nearby NGOs.");
        setShowToast(true);
      } else {
        setLocationError("Could not get your location. Please try entering a city.");
      }
    } catch (error) {
      setLocationError("Location access denied. Please enter a city instead.");
    } finally {
      setLocationLoading(false);
    }
  };

  const handleUseCity = () => {
    const coords = coordsFromCity(cityInput);
    if (coords) {
      const location = { ...coords, accuracy: 1000 };
      saveUserLocation(location);
      setUserLoc(location);
      computeNearest(resources, location);
      setShowLocationInput(false);
      setCityInput("");
      setLocationError("");
      setToastMessage(`Location set to ${cityInput}.`);
      setShowToast(true);
    } else {
      setLocationError("City not recognized. Please choose from: Delhi, Mumbai, Chennai, Hyderabad");
    }
  };

  async function genPDF() {
    if (!data) return;
    const blob = await generateLegalPackPDF({
      reportId: id, 
      createdAtISO: new Date().toISOString(),
      reporterSummary: data.summary || "", 
      tags: data.tags || [], 
      severity: data.severity || 3, 
      urgency: data.urgency || "medium",
      sha256: data.fileSha256 || "", 
      anchorTxHash: data.anchorTxHash || "", 
      anchorExplorer: data.anchorExplorer || "https://sepolia.etherscan.io/tx/",
      resources: resources.slice(0, 6).map((r: any) => ({ name: r.name, contact: r.contact || "" })),
      nearestResources: nearest.length > 0 && userLoc ? nearest.slice(0, 3).map(n => ({ 
        name: n.name, 
        contact: n.contact, 
        distanceKm: n.distanceKm 
      })) : undefined
    });
    downloadBlob(blob, `SafeSpeak_LegalPack_${id}.pdf`);
  }

  async function shareSOS() {
    if (!data) return;
    const url = typeof window !== "undefined" ? window.location.href : "";
    const message = `SOS from SafeSpeak: I may need help.\nReport ID: ${id}\nSummary: ${data.summary}\nOn-chain: ${(data.anchorExplorer || "https://sepolia.etherscan.io/tx/")}${data.anchorTxHash || ""}\nLink: ${url}`;
    if (navigator.share) { try { await navigator.share({ title: "SafeSpeak SOS", text: message, url }); } catch {} }
    else { prompt("Copy and send this message:", message); }
  }

  if (loading) return <main className="p-6">Loading...</main>;
  if (!data) return <main className="p-6">Not found</main>;

  return (
    <main className="max-w-2xl mx-auto p-6 space-y-6">
      <div className="space-y-3">
        <h2 className="text-2xl font-bold text-gray-900">Report Details</h2>
        <div className="bg-white p-4 rounded-lg border border-gray-200 space-y-2">
          <div><span className="font-semibold text-gray-700">Summary:</span> <span className="text-gray-900">{data.summary}</span></div>
          <div><span className="font-semibold text-gray-700">Tags:</span> <span className="text-gray-600">{(data.tags || []).join(", ")}</span></div>
          <div><span className="font-semibold text-gray-700">Severity:</span> <span className="text-gray-900">{data.severity}</span></div>
          {data.anchorTxHash && (
            <div>
              <span className="font-semibold text-gray-700">On-chain anchor: </span>
              <a className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer" href={`${data.anchorExplorer || "https://sepolia.etherscan.io/tx/"}${data.anchorTxHash}`}>View Transaction</a>
            </div>
          )}
        </div>
      </div>

      {/* Nearby Help Section */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Nearby help (top 3)</h3>
        
        {userLoc && nearest.length > 0 ? (
          <div className="space-y-3">
            {nearest.map((ngo) => (
              <div key={ngo.id} className="bg-white p-3 rounded-md border border-gray-200">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-gray-900">{ngo.name}</h4>
                      {ngo.verified && (
                        <span className="px-1.5 py-0.5 text-xs font-medium rounded-full bg-emerald-100 text-emerald-800">
                          Verified
                        </span>
                      )}
                    </div>
                    {ngo.region && (
                      <p className="text-sm text-gray-600 mt-1">{ngo.region}</p>
                    )}
                    <p className="text-sm text-blue-600 font-medium mt-1">
                      {formatDistance(ngo.distanceKm)} away
                    </p>
                  </div>
                  {ngo.contact && (
                    <a
                      href={`tel:${ngo.contact}`}
                      className="px-3 py-1.5 text-sm font-medium text-blue-700 bg-blue-100 rounded hover:bg-blue-200"
                      aria-label={`Call ${ngo.name}`}
                    >
                      Call
                    </a>
                  )}
                </div>
              </div>
            ))}
            <Link 
              href="/resources"
              className="inline-block text-sm text-blue-600 hover:underline mt-2"
            >
              View all resources →
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-sm text-gray-700">Set your location to see nearby help organizations.</p>
            
            {!showLocationInput ? (
              <button
                onClick={() => setShowLocationInput(true)}
                className="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-md hover:bg-blue-700"
                aria-label="Set location"
              >
                Set location
              </button>
            ) : (
              <div className="space-y-3 bg-white p-3 rounded-md border border-gray-200">
                <div className="flex gap-2">
                  <button
                    onClick={handleUseMyLocation}
                    disabled={locationLoading}
                    className="px-3 py-2 text-sm font-medium bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300"
                  >
                    {locationLoading ? 'Detecting...' : 'Use my location'}
                  </button>
                  <button
                    onClick={() => setShowLocationInput(false)}
                    className="px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                  >
                    Cancel
                  </button>
                </div>
                
                <div className="pt-2 border-t border-gray-100">
                  <p className="text-xs text-gray-600 mb-2">Or enter your city:</p>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={cityInput}
                      onChange={(e) => setCityInput(e.target.value)}
                      placeholder="E.g., Delhi, Mumbai"
                      className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-md"
                      list="cities"
                    />
                    <datalist id="cities">
                      {['Delhi', 'Mumbai', 'Chennai', 'Hyderabad'].map(city => (
                        <option key={city} value={city} />
                      ))}
                    </datalist>
                    <button
                      onClick={handleUseCity}
                      disabled={!cityInput.trim()}
                      className="px-3 py-2 text-sm font-medium bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200 disabled:opacity-50"
                    >
                      Use city
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Suggestions: Delhi, Mumbai, Chennai, Hyderabad
                  </p>
                </div>
                
                {locationError && (
                  <p className="text-sm text-red-600">{locationError}</p>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="flex gap-3 pt-2">
        <button 
          onClick={genPDF} 
          className="px-4 py-2 bg-slate-800 text-white rounded-md hover:bg-slate-900 font-medium"
        >
          Download Legal Pack
        </button>
        <button 
          onClick={shareSOS} 
          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 font-medium"
        >
          Send SOS
        </button>
      </div>

      {/* Location Toast */}
      {showToast && (
        <LocationToast
          message={toastMessage}
          onClear={userLoc ? () => {
            setUserLoc(null);
            localStorage.removeItem('userLocation');
            setNearest([]);
            setToastMessage("Location cleared.");
            setShowToast(true);
          } : undefined}
          onDismiss={() => setShowToast(false)}
        />
      )}
    </main>
  );
}