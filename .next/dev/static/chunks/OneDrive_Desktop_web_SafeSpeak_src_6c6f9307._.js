(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/OneDrive/Desktop/web/SafeSpeak/src/components/LocationToast.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>LocationToast
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/web/SafeSpeak/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/web/SafeSpeak/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
function LocationToast({ message, onClear, onDismiss, duration = 5000 }) {
    _s();
    const [isVisible, setIsVisible] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "LocationToast.useEffect": ()=>{
            if (duration > 0) {
                const timer = setTimeout({
                    "LocationToast.useEffect.timer": ()=>{
                        setIsVisible(false);
                        onDismiss?.();
                    }
                }["LocationToast.useEffect.timer"], duration);
                return ({
                    "LocationToast.useEffect": ()=>clearTimeout(timer)
                })["LocationToast.useEffect"];
            }
        }
    }["LocationToast.useEffect"], [
        duration,
        onDismiss
    ]);
    if (!isVisible) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "fixed bottom-4 right-4 z-50 max-w-sm animate-fadeUp",
        role: "status",
        "aria-live": "polite",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "bg-white border border-gray-200 rounded-lg shadow-lg p-4 flex items-start gap-3",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex-1",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-sm text-gray-800",
                        children: message
                    }, void 0, false, {
                        fileName: "[project]/OneDrive/Desktop/web/SafeSpeak/src/components/LocationToast.tsx",
                        lineNumber: 40,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/OneDrive/Desktop/web/SafeSpeak/src/components/LocationToast.tsx",
                    lineNumber: 39,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex gap-2",
                    children: [
                        onClear && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: ()=>{
                                onClear();
                                setIsVisible(false);
                            },
                            className: "text-xs text-blue-600 hover:text-blue-800 font-medium",
                            "aria-label": "Clear location",
                            children: "Clear"
                        }, void 0, false, {
                            fileName: "[project]/OneDrive/Desktop/web/SafeSpeak/src/components/LocationToast.tsx",
                            lineNumber: 44,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: ()=>{
                                setIsVisible(false);
                                onDismiss?.();
                            },
                            className: "text-gray-400 hover:text-gray-600",
                            "aria-label": "Dismiss",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                className: "w-4 h-4",
                                fill: "currentColor",
                                viewBox: "0 0 20 20",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                    fillRule: "evenodd",
                                    d: "M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z",
                                    clipRule: "evenodd"
                                }, void 0, false, {
                                    fileName: "[project]/OneDrive/Desktop/web/SafeSpeak/src/components/LocationToast.tsx",
                                    lineNumber: 64,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/OneDrive/Desktop/web/SafeSpeak/src/components/LocationToast.tsx",
                                lineNumber: 63,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/OneDrive/Desktop/web/SafeSpeak/src/components/LocationToast.tsx",
                            lineNumber: 55,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/OneDrive/Desktop/web/SafeSpeak/src/components/LocationToast.tsx",
                    lineNumber: 42,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/OneDrive/Desktop/web/SafeSpeak/src/components/LocationToast.tsx",
            lineNumber: 38,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/OneDrive/Desktop/web/SafeSpeak/src/components/LocationToast.tsx",
        lineNumber: 33,
        columnNumber: 5
    }, this);
}
_s(LocationToast, "m22S9IQwDfEe/fCJY7LYj8YPDMo=");
_c = LocationToast;
var _c;
__turbopack_context__.k.register(_c, "LocationToast");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/OneDrive/Desktop/web/SafeSpeak/src/lib/geo.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Geographic location utilities
 * @module geo
 */ __turbopack_context__.s([
    "coordsFromCity",
    ()=>coordsFromCity,
    "formatDistance",
    ()=>formatDistance,
    "geocodeCity",
    ()=>geocodeCity,
    "getUserLocation",
    ()=>getUserLocation,
    "haversineKm",
    ()=>haversineKm,
    "loadUserLocation",
    ()=>loadUserLocation,
    "roundCoords",
    ()=>roundCoords,
    "saveUserLocation",
    ()=>saveUserLocation
]);
const STORAGE_KEY = 'userLocation';
// City coordinates map (normalized to lowercase, no spaces)
const CITY_MAP = {
    delhi: {
        lat: 28.6139,
        lng: 77.2090
    },
    mumbai: {
        lat: 19.0760,
        lng: 72.8777
    },
    chennai: {
        lat: 13.0827,
        lng: 80.2707
    },
    hyderabad: {
        lat: 17.3850,
        lng: 78.4867
    }
};
async function getUserLocation(opts = {}) {
    if (("TURBOPACK compile-time value", "object") === 'undefined' || !navigator?.geolocation) {
        return null;
    }
    try {
        // Check permission state
        const permission = await navigator.permissions.query({
            name: 'geolocation'
        });
        if (permission.state === 'denied') {
            return null;
        }
        // If permission is granted or prompt, try to get location
        return new Promise((resolve)=>{
            const timeout = opts.timeoutMs ?? 15000;
            const options = {
                enableHighAccuracy: true,
                timeout,
                maximumAge: 0
            };
            const timer = setTimeout(()=>{
                resolve(null);
            }, timeout);
            navigator.geolocation.getCurrentPosition((pos)=>{
                clearTimeout(timer);
                const { latitude: lat, longitude: lng, accuracy } = pos.coords;
                const coords = {
                    lat,
                    lng,
                    accuracy
                };
                saveUserLocation(coords);
                resolve(coords);
            }, ()=>{
                clearTimeout(timer);
                resolve(null);
            }, options);
        });
    } catch (error) {
        console.error('Error getting location:', error);
        return null;
    }
}
function haversineKm(a, b) {
    const R = 6371; // Earth's radius in km
    const dLat = toRad(b.lat - a.lat);
    const dLng = toRad(b.lng - a.lng);
    const lat1 = toRad(a.lat);
    const lat2 = toRad(b.lat);
    const x = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.sin(dLng / 2) * Math.sin(dLng / 2) * Math.cos(lat1) * Math.cos(lat2);
    const c = 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
    const distance = R * c;
    // Round to 1 decimal place
    return Math.round(distance * 10) / 10;
}
function formatDistance(km) {
    return km < 1 ? '< 1 km' : `${km.toFixed(1)} km`;
}
function roundCoords(c, decimals = 3) {
    const factor = Math.pow(10, decimals);
    return {
        lat: Math.round(c.lat * factor) / factor,
        lng: Math.round(c.lng * factor) / factor,
        accuracy: c.accuracy
    };
}
function saveUserLocation(c, opts) {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    try {
        const toSave = opts?.precise ? c : roundCoords(c);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
    } catch (error) {
        console.error('Error saving location to localStorage:', error);
    }
}
function loadUserLocation() {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    try {
        const data = localStorage.getItem(STORAGE_KEY);
        if (!data) return null;
        const coords = JSON.parse(data);
        if (typeof coords?.lat === 'number' && typeof coords?.lng === 'number') {
            return {
                lat: coords.lat,
                lng: coords.lng,
                accuracy: typeof coords.accuracy === 'number' ? coords.accuracy : undefined
            };
        }
    } catch (error) {
        console.error('Error loading location from localStorage:', error);
    }
    return null;
}
function coordsFromCity(input) {
    if (!input) return null;
    // Normalize: lowercase and remove all spaces
    const normalized = input.toLowerCase().replace(/\s+/g, '');
    return CITY_MAP[normalized] || null;
}
async function geocodeCity(query) {
    if (!query || ("TURBOPACK compile-time value", "object") === 'undefined') return null;
    try {
        const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`;
        const response = await fetch(url, {
            headers: {
                'Accept-Language': 'en',
                'User-Agent': 'SafeSpeak/1.0'
            }
        });
        if (!response.ok) return null;
        const results = await response.json();
        if (!results || results.length === 0) return null;
        const hit = results[0];
        return {
            lat: parseFloat(hit.lat),
            lng: parseFloat(hit.lon),
            accuracy: 5000
        };
    } catch (error) {
        console.error('Geocoding error:', error);
        return null;
    }
}
// Helper function to convert degrees to radians
function toRad(degrees) {
    return degrees * Math.PI / 180;
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/OneDrive/Desktop/web/SafeSpeak/src/lib/utils.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "cn",
    ()=>cn
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/web/SafeSpeak/node_modules/clsx/dist/clsx.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$node_modules$2f$tailwind$2d$merge$2f$dist$2f$bundle$2d$mjs$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/web/SafeSpeak/node_modules/tailwind-merge/dist/bundle-mjs.mjs [app-client] (ecmascript)");
;
;
function cn(...inputs) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$node_modules$2f$tailwind$2d$merge$2f$dist$2f$bundle$2d$mjs$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["twMerge"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["clsx"])(inputs));
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/OneDrive/Desktop/web/SafeSpeak/src/components/ui/masonry-grid-with-scroll-animation.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "MasonryCard",
    ()=>MasonryCard,
    "MasonryGrid",
    ()=>MasonryGrid
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/web/SafeSpeak/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/web/SafeSpeak/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/web/SafeSpeak/src/lib/utils.ts [app-client] (ecmascript)");
;
;
;
/**
 * A component to inject the necessary CSS for the MasonryGrid animations.
 * This avoids the need for a separate CSS file.
 * @returns {JSX.Element} A style tag with the required CSS.
 */ const MasonryGridCSS = ()=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("style", {
        children: `
    @keyframes slide-in {
      from {
        opacity: 0;
        transform: scale(0.85) rotate(calc(var(--side, 1) * (5deg * var(--amp, 1))));
      }
      to {
        opacity: 1;
        transform: scale(1) rotate(0deg);
      }
    }

    .masonry-card-wrapper {
      /* Set transform origin based on column position */
      &:nth-of-type(2n + 1) { transform-origin: 25vw 100%; }
      &:nth-of-type(2n) { transform-origin: -25vw 100%; }

      @media (min-width: 768px) {
        &:nth-of-type(4n + 1) { transform-origin: 50vw 100%; }
        &:nth-of-type(4n + 2) { transform-origin: 25vw 100%; }
        &:nth-of-type(4n + 3) { transform-origin: -25vw 100%; }
        &:nth-of-type(4n) { transform-origin: -50vw 100%; }
      }

      @media (min-width: 1024px) {
        &:nth-of-type(6n + 1) { transform-origin: 75vw 100%; }
        &:nth-of-type(6n + 2) { transform-origin: 50vw 100%; }
        &:nth-of-type(6n + 3) { transform-origin: 25vw 100%; }
        &:nth-of-type(6n + 4) { transform-origin: -25vw 100%; }
        &:nth-of-type(6n + 5) { transform-origin: -50vw 100%; }
        &:nth-of-type(6n) { transform-origin: -75vw 100%; }
      }

      /* Animation powered by CSS Scroll-Driven Animations */
      @media (prefers-reduced-motion: no-preference) {
        animation: slide-in linear both;
        animation-timeline: view();
        animation-range: entry 0% cover 15%;
      }
    }
  `
    }, void 0, false, {
        fileName: "[project]/OneDrive/Desktop/web/SafeSpeak/src/components/ui/masonry-grid-with-scroll-animation.tsx",
        lineNumber: 37,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0));
_c = MasonryGridCSS;
/**
 * A single card component within the masonry grid.
 * @param {object} props - The component props.
 * @param {MasonryCardData} props.item - The data for the card.
 * @param {string} [props.className] - Additional class names.
 * @returns {JSX.Element} The rendered card element.
 */ const MasonryCard = ({ item, className, ...props })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('grid gap-2', className),
        ...props,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("article", {
            className: "bg-card border rounded-lg shadow-md p-3 space-y-2",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                    src: item.src,
                    alt: item.alt,
                    height: 500,
                    width: 500,
                    className: "bg-muted rounded-md aspect-square object-cover w-full"
                }, void 0, false, {
                    fileName: "[project]/OneDrive/Desktop/web/SafeSpeak/src/components/ui/masonry-grid-with-scroll-animation.tsx",
                    lineNumber: 94,
                    columnNumber: 7
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "text-sm text-muted-foreground leading-tight line-clamp-2",
                    children: item.content
                }, void 0, false, {
                    fileName: "[project]/OneDrive/Desktop/web/SafeSpeak/src/components/ui/masonry-grid-with-scroll-animation.tsx",
                    lineNumber: 101,
                    columnNumber: 7
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                    href: item.linkHref,
                    target: "_blank",
                    rel: "noopener noreferrer",
                    className: "text-sm font-medium text-primary hover:underline",
                    children: item.linkText
                }, void 0, false, {
                    fileName: "[project]/OneDrive/Desktop/web/SafeSpeak/src/components/ui/masonry-grid-with-scroll-animation.tsx",
                    lineNumber: 104,
                    columnNumber: 7
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/OneDrive/Desktop/web/SafeSpeak/src/components/ui/masonry-grid-with-scroll-animation.tsx",
            lineNumber: 93,
            columnNumber: 5
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/OneDrive/Desktop/web/SafeSpeak/src/components/ui/masonry-grid-with-scroll-animation.tsx",
        lineNumber: 92,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0));
_c1 = MasonryCard;
/**
 * A responsive masonry grid that animates items into view on scroll.
 * @param {MasonryGridProps} props - The component props.
 * @returns {JSX.Element} The rendered masonry grid.
 */ const MasonryGrid = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].forwardRef(_c2 = ({ items, className, ...props }, ref)=>{
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(MasonryGridCSS, {}, void 0, false, {
                fileName: "[project]/OneDrive/Desktop/web/SafeSpeak/src/components/ui/masonry-grid-with-scroll-animation.tsx",
                lineNumber: 125,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                ref: ref,
                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 xl:grid-cols-7 2xl:grid-cols-7 gap-15 md:gap-12 xl:gap-16 p-4', className),
                ...props,
                children: items.map((item, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(MasonryCard, {
                        item: item,
                        className: "masonry-card-wrapper",
                        style: {
                            '--side': index % 2 === 0 ? 1 : -1,
                            '--amp': Math.ceil(index % 8 / 2)
                        }
                    }, item.id, false, {
                        fileName: "[project]/OneDrive/Desktop/web/SafeSpeak/src/components/ui/masonry-grid-with-scroll-animation.tsx",
                        lineNumber: 135,
                        columnNumber: 13
                    }, ("TURBOPACK compile-time value", void 0)))
            }, void 0, false, {
                fileName: "[project]/OneDrive/Desktop/web/SafeSpeak/src/components/ui/masonry-grid-with-scroll-animation.tsx",
                lineNumber: 126,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true);
});
_c3 = MasonryGrid;
MasonryGrid.displayName = 'MasonryGrid';
;
var _c, _c1, _c2, _c3;
__turbopack_context__.k.register(_c, "MasonryGridCSS");
__turbopack_context__.k.register(_c1, "MasonryCard");
__turbopack_context__.k.register(_c2, "MasonryGrid$React.forwardRef");
__turbopack_context__.k.register(_c3, "MasonryGrid");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/OneDrive/Desktop/web/SafeSpeak/src/app/resources/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Resources
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/web/SafeSpeak/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/web/SafeSpeak/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$node_modules$2f$next$2f$dist$2f$shared$2f$lib$2f$app$2d$dynamic$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/web/SafeSpeak/node_modules/next/dist/shared/lib/app-dynamic.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$src$2f$components$2f$LocationToast$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/web/SafeSpeak/src/components/LocationToast.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$src$2f$lib$2f$geo$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/web/SafeSpeak/src/lib/geo.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$src$2f$components$2f$ui$2f$masonry$2d$grid$2d$with$2d$scroll$2d$animation$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/web/SafeSpeak/src/components/ui/masonry-grid-with-scroll-animation.tsx [app-client] (ecmascript)");
;
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
// Dynamic import for map component (client-only, no SSR)
const ResourcesMap = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$node_modules$2f$next$2f$dist$2f$shared$2f$lib$2f$app$2d$dynamic$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(()=>__turbopack_context__.A("[project]/OneDrive/Desktop/web/SafeSpeak/src/components/ResourcesMap.tsx [app-client] (ecmascript, next/dynamic entry, async loader)"), {
    loadableGenerated: {
        modules: [
            "[project]/OneDrive/Desktop/web/SafeSpeak/src/components/ResourcesMap.tsx [app-client] (ecmascript, next/dynamic entry)"
        ]
    },
    ssr: false,
    loading: ()=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "w-full h-[60vh] rounded-lg bg-gray-100 flex items-center justify-center",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-gray-600",
                children: "Loading map..."
            }, void 0, false, {
                fileName: "[project]/OneDrive/Desktop/web/SafeSpeak/src/app/resources/page.tsx",
                lineNumber: 23,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
        }, void 0, false, {
            fileName: "[project]/OneDrive/Desktop/web/SafeSpeak/src/app/resources/page.tsx",
            lineNumber: 22,
            columnNumber: 5
        }, ("TURBOPACK compile-time value", void 0))
});
_c = ResourcesMap;
// Local storage keys
const STORAGE_KEYS = {
    USER_LOCATION: 'userLocation',
    GEO_PROMPT_SNOOZE: 'geoPromptSnoozeAt'
};
// 24 hours in milliseconds
const SNOOZE_DURATION = 24 * 60 * 60 * 1000;
function Resources() {
    _s();
    const [items, setItems] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [userLoc, setUserLoc] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [statusMsg, setStatusMsg] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [radius, setRadius] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(Infinity); // Default: Show all
    const [perPage, setPerPage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(Infinity); // Default: Show all
    const [banner, setBanner] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        isVisible: false,
        isLoading: false
    });
    const [modal, setModal] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        isOpen: false,
        cityInput: ''
    });
    const [permissionState, setPermissionState] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [mounted, setMounted] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const cardRefs = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(new Map());
    const [showToast, setShowToast] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [toastMessage, setToastMessage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [geocoding, setGeocoding] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [geocodedCity, setGeocodedCity] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [lastUpdated, setLastUpdated] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [userCity, setUserCity] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        "Resources.useState": ()=>{
            if ("TURBOPACK compile-time truthy", 1) {
                return localStorage.getItem('userCity');
            }
            //TURBOPACK unreachable
            ;
        }
    }["Resources.useState"]);
    // Set user city in state and localStorage
    const setUserCityWithStorage = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "Resources.useCallback[setUserCityWithStorage]": (city)=>{
            setUserCity(city);
            if (city) {
                localStorage.setItem('userCity', city);
            } else {
                localStorage.removeItem('userCity');
            }
        }
    }["Resources.useCallback[setUserCityWithStorage]"], []);
    // Handle Top 5 near me
    const handleTop5NearMe = ()=>{
        if (!userLoc) {
            setToastMessage('Please set your location first');
            setShowToast(true);
            return;
        }
        setPerPage(5);
    // The useEffect with fetchNgos will trigger automatically
    };
    // Handle reset filters
    const handleResetFilters = ()=>{
        setPerPage(Infinity);
        setRadius(Infinity);
    // The useEffect with fetchNgos will trigger automatically
    };
    // Check if we should show the banner
    const shouldShowBanner = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "Resources.useCallback[shouldShowBanner]": ()=>{
            // Don't show if we have a location
            if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$src$2f$lib$2f$geo$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["loadUserLocation"])()) return false;
            // Check if user has snoozed the banner
            const snoozeTime = localStorage.getItem(STORAGE_KEYS.GEO_PROMPT_SNOOZE);
            if (snoozeTime) {
                const snoozeUntil = parseInt(snoozeTime, 10);
                if (Date.now() < snoozeUntil) return false;
            }
            return true;
        }
    }["Resources.useCallback[shouldShowBanner]"], []);
    // Check permissions and load location
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Resources.useEffect": ()=>{
            const checkPermissions = {
                "Resources.useEffect.checkPermissions": async ()=>{
                    try {
                        const permission = await navigator.permissions.query({
                            name: 'geolocation'
                        });
                        setPermissionState(permission.state);
                        permission.onchange = ({
                            "Resources.useEffect.checkPermissions": ()=>{
                                setPermissionState(permission.state);
                            }
                        })["Resources.useEffect.checkPermissions"];
                    } catch (e) {
                        console.warn('Permissions API not supported');
                    }
                }
            }["Resources.useEffect.checkPermissions"];
            const savedLoc = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$src$2f$lib$2f$geo$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["loadUserLocation"])();
            if (savedLoc) {
                setUserLoc(savedLoc);
                setStatusMsg("Using precise location");
                setBanner({
                    "Resources.useEffect": (prev)=>({
                            ...prev,
                            isVisible: false
                        })
                }["Resources.useEffect"]);
            } else if (shouldShowBanner()) {
                setBanner({
                    isVisible: true,
                    isLoading: false
                });
            }
            setMounted(true);
            checkPermissions();
        }
    }["Resources.useEffect"], [
        shouldShowBanner
    ]);
    // Handle location detection
    const handleLocationRequest = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "Resources.useCallback[handleLocationRequest]": async ()=>{
            setBanner({
                "Resources.useCallback[handleLocationRequest]": (prev)=>({
                        ...prev,
                        isLoading: true,
                        error: undefined
                    })
            }["Resources.useCallback[handleLocationRequest]"]);
            try {
                const location = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$src$2f$lib$2f$geo$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getUserLocation"])({
                    timeoutMs: 10000
                });
                if (location) {
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$src$2f$lib$2f$geo$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["saveUserLocation"])(location);
                    setUserLoc(location);
                    setUserCityWithStorage(null); // Clear city when using precise location
                    setStatusMsg("Using precise location");
                    setBanner({
                        "Resources.useCallback[handleLocationRequest]": (prev)=>({
                                ...prev,
                                isVisible: false
                            })
                    }["Resources.useCallback[handleLocationRequest]"]);
                    setToastMessage("Location set to approximate area. We only use this to sort nearby NGOs.");
                    setShowToast(true);
                } else {
                    // Handle denied permission
                    if (permissionState === 'denied') {
                        setBanner({
                            "Resources.useCallback[handleLocationRequest]": (prev)=>({
                                    ...prev,
                                    error: 'Location is blocked by the browser. Use the city option instead.'
                                })
                        }["Resources.useCallback[handleLocationRequest]"]);
                    } else {
                        setBanner({
                            "Resources.useCallback[handleLocationRequest]": (prev)=>({
                                    ...prev,
                                    error: 'Could not determine your location. Please try again or enter a city.'
                                })
                        }["Resources.useCallback[handleLocationRequest]"]);
                    }
                }
            } catch (error) {
                console.error('Location error:', error);
                setBanner({
                    "Resources.useCallback[handleLocationRequest]": (prev)=>({
                            ...prev,
                            error: 'Could not determine your location. Please try again or enter a city.'
                        })
                }["Resources.useCallback[handleLocationRequest]"]);
            } finally{
                setBanner({
                    "Resources.useCallback[handleLocationRequest]": (prev)=>({
                            ...prev,
                            isLoading: false
                        })
                }["Resources.useCallback[handleLocationRequest]"]);
            }
        }
    }["Resources.useCallback[handleLocationRequest]"], [
        permissionState
    ]);
    // Debounced geocoding for city input
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Resources.useEffect": ()=>{
            if (!modal.cityInput || modal.cityInput.length < 3) {
                setGeocodedCity(null);
                return;
            }
            // Check if it's in our predefined list first
            const predefined = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$src$2f$lib$2f$geo$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["coordsFromCity"])(modal.cityInput);
            if (predefined) {
                setGeocodedCity({
                    name: modal.cityInput,
                    coords: predefined
                });
                return;
            }
            // Debounce geocoding API call
            const timer = setTimeout({
                "Resources.useEffect.timer": async ()=>{
                    setGeocoding(true);
                    const coords = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$src$2f$lib$2f$geo$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["geocodeCity"])(modal.cityInput);
                    if (coords) {
                        setGeocodedCity({
                            name: modal.cityInput,
                            coords
                        });
                    } else {
                        setGeocodedCity(null);
                    }
                    setGeocoding(false);
                }
            }["Resources.useEffect.timer"], 500);
            return ({
                "Resources.useEffect": ()=>clearTimeout(timer)
            })["Resources.useEffect"];
        }
    }["Resources.useEffect"], [
        modal.cityInput
    ]);
    // Handle city submission from modal
    const handleCitySubmit = ()=>{
        const coords = geocodedCity?.coords || (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$src$2f$lib$2f$geo$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["coordsFromCity"])(modal.cityInput);
        if (coords) {
            const location = {
                ...coords,
                accuracy: 1000
            }; // Approximate accuracy for city
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$src$2f$lib$2f$geo$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["saveUserLocation"])(location);
            setUserLoc(location);
            const cityName = geocodedCity?.name || modal.cityInput;
            setUserCityWithStorage(cityName);
            setStatusMsg(`Using city: ${cityName}`);
            setModal({
                isOpen: false,
                cityInput: ''
            });
            setBanner((prev)=>({
                    ...prev,
                    isVisible: false
                }));
            setToastMessage(`Location set to ${cityName}.`);
            setShowToast(true);
            setGeocodedCity(null);
        } else {
            setModal((prev)=>({
                    ...prev,
                    error: 'City not found. Please try another city name.'
                }));
        }
    };
    // Snooze the banner for 24 hours
    const snoozeBanner = ()=>{
        const snoozeUntil = Date.now() + SNOOZE_DURATION;
        localStorage.setItem(STORAGE_KEYS.GEO_PROMPT_SNOOZE, snoozeUntil.toString());
        setBanner((prev)=>({
                ...prev,
                isVisible: false
            }));
    };
    // Fetch NGOs with offline cache (stale-while-revalidate)
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Resources.useEffect": ()=>{
            const CACHE_KEY = 'resourcesCache';
            const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours
            const fetchNgos = {
                "Resources.useEffect.fetchNgos": async ()=>{
                    setLoading(true);
                    try {
                        // If we have user location, use the /near endpoint
                        if (userLoc) {
                            const params = new URLSearchParams({
                                lat: userLoc.lat.toString(),
                                lng: userLoc.lng.toString(),
                                radiusKm: radius === Infinity ? 'all' : radius.toString(),
                                limit: perPage === Infinity ? '1000' : perPage.toString(),
                                ...userCity ? {
                                    city: userCity
                                } : {}
                            });
                            const url = `/api/resources/near?${params.toString()}`;
                            console.log('Fetching from:', url);
                            const response = await fetch(url, {
                                cache: 'no-store'
                            });
                            if (!response.ok) throw new Error('Failed to fetch nearby NGOs');
                            const data = await response.json();
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
                        const data = await response.json();
                        // Update cache
                        const fetchedAt = Date.now();
                        localStorage.setItem(CACHE_KEY, JSON.stringify({
                            data,
                            fetchedAt
                        }));
                        setLastUpdated(fetchedAt);
                        // Process and sort NGOs
                        const processed = processNgos(data, userLoc);
                        setItems(processed);
                    } catch (error) {
                        console.error('Error fetching NGOs:', error);
                        setToastMessage('Error loading NGOs. Please try again.');
                        setShowToast(true);
                    } finally{
                        setLoading(false);
                    }
                }
            }["Resources.useEffect.fetchNgos"];
            fetchNgos();
        }
    }["Resources.useEffect"], [
        userLoc,
        radius,
        perPage,
        userCity
    ]);
    // Process and sort NGOs based on user location
    const processNgos = (ngos, location)=>{
        return ngos.map((ngo)=>{
            // Calculate distance if we have user location and NGO coordinates
            let distance;
            if (location && ngo.lat !== null && ngo.lng !== null) {
                distance = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$src$2f$lib$2f$geo$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["haversineKm"])(location, {
                    lat: ngo.lat,
                    lng: ngo.lng
                });
            }
            return {
                ...ngo,
                distanceKm: distance
            };
        }).sort((a, b)=>{
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
    const clearLocation = ()=>{
        setUserLoc(null);
        setUserCityWithStorage(null);
        localStorage.removeItem(STORAGE_KEYS.USER_LOCATION);
        localStorage.removeItem(STORAGE_KEYS.GEO_PROMPT_SNOOZE);
        setStatusMsg("");
        setBanner({
            isVisible: shouldShowBanner(),
            isLoading: false
        });
        setToastMessage("Location cleared.");
        setShowToast(true);
        setPerPage(Infinity);
        setRadius(Infinity);
    };
    // Filter NGOs by radius
    const filteredItems = items.filter((ngo)=>{
        if (!Number.isFinite(radius)) return true; // Show all if Infinity
        return ngo.distanceKm === undefined || ngo.distanceKm <= radius;
    });
    // Pagination
    const visibleItems = Number.isFinite(perPage) ? filteredItems.slice(0, perPage) : filteredItems;
    const masonryItems = visibleItems.map((ngo)=>({
            id: ngo.id,
            src: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=500',
            alt: ngo.name,
            content: ngo.services.join(', '),
            linkHref: '#',
            linkText: 'Learn more'
        }));
    // Only render client-side to avoid hydration issues
    if (!mounted) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
            className: "w-full max-w-screen-2xl mx-auto p-6",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "h-8"
                }, void 0, false, {
                    fileName: "[project]/OneDrive/Desktop/web/SafeSpeak/src/app/resources/page.tsx",
                    lineNumber: 392,
                    columnNumber: 9
                }, this),
                " ",
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "animate-pulse space-y-4",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "h-8 bg-gray-200 rounded w-1/2"
                        }, void 0, false, {
                            fileName: "[project]/OneDrive/Desktop/web/SafeSpeak/src/app/resources/page.tsx",
                            lineNumber: 394,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "h-12 bg-gray-100 rounded"
                        }, void 0, false, {
                            fileName: "[project]/OneDrive/Desktop/web/SafeSpeak/src/app/resources/page.tsx",
                            lineNumber: 395,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "space-y-3",
                            children: [
                                1,
                                2,
                                3
                            ].map((i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "h-24 bg-gray-50 rounded-lg"
                                }, i, false, {
                                    fileName: "[project]/OneDrive/Desktop/web/SafeSpeak/src/app/resources/page.tsx",
                                    lineNumber: 398,
                                    columnNumber: 15
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/OneDrive/Desktop/web/SafeSpeak/src/app/resources/page.tsx",
                            lineNumber: 396,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/OneDrive/Desktop/web/SafeSpeak/src/app/resources/page.tsx",
                    lineNumber: 393,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/OneDrive/Desktop/web/SafeSpeak/src/app/resources/page.tsx",
            lineNumber: 391,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
        className: "w-full max-w-screen-2xl mx-auto p-6 space-y-6",
        children: [
            banner.isVisible && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 flex flex-col sm:flex-row items-start sm:items-center gap-3",
                role: "alert",
                "aria-live": "polite",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex-1",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-sm text-blue-800",
                                children: "Share approximate location to sort nearby help. We only use this to find NGOs near you."
                            }, void 0, false, {
                                fileName: "[project]/OneDrive/Desktop/web/SafeSpeak/src/app/resources/page.tsx",
                                lineNumber: 416,
                                columnNumber: 13
                            }, this),
                            banner.error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "mt-1 text-sm text-red-600",
                                children: banner.error
                            }, void 0, false, {
                                fileName: "[project]/OneDrive/Desktop/web/SafeSpeak/src/app/resources/page.tsx",
                                lineNumber: 420,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/OneDrive/Desktop/web/SafeSpeak/src/app/resources/page.tsx",
                        lineNumber: 415,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex flex-col sm:flex-row gap-2 w-full sm:w-auto",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: handleLocationRequest,
                                disabled: banner.isLoading,
                                className: "px-3 py-1.5 text-sm font-medium bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300 transition-colors",
                                "aria-label": "Use my current location",
                                children: banner.isLoading ? 'Detecting...' : 'Use my location'
                            }, void 0, false, {
                                fileName: "[project]/OneDrive/Desktop/web/SafeSpeak/src/app/resources/page.tsx",
                                lineNumber: 424,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>setModal({
                                        isOpen: true,
                                        cityInput: ''
                                    }),
                                className: "px-3 py-1.5 text-sm font-medium bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors",
                                children: "Enter city"
                            }, void 0, false, {
                                fileName: "[project]/OneDrive/Desktop/web/SafeSpeak/src/app/resources/page.tsx",
                                lineNumber: 432,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: snoozeBanner,
                                className: "px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800",
                                "aria-label": "Dismiss for 24 hours",
                                children: "Not now"
                            }, void 0, false, {
                                fileName: "[project]/OneDrive/Desktop/web/SafeSpeak/src/app/resources/page.tsx",
                                lineNumber: 438,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/OneDrive/Desktop/web/SafeSpeak/src/app/resources/page.tsx",
                        lineNumber: 423,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/OneDrive/Desktop/web/SafeSpeak/src/app/resources/page.tsx",
                lineNumber: 410,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "space-y-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                        className: "text-2xl font-bold text-gray-900",
                        children: "Find Help Near You"
                    }, void 0, false, {
                        fileName: "[project]/OneDrive/Desktop/web/SafeSpeak/src/app/resources/page.tsx",
                        lineNumber: 450,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "bg-white p-4 rounded-lg shadow-sm border border-gray-200",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex flex-col sm:flex-row sm:items-center gap-3",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: handleLocationRequest,
                                    disabled: banner.isLoading,
                                    className: "px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300 transition-colors",
                                    "aria-label": "Use my current location",
                                    children: banner.isLoading ? 'Detecting...' : 'Use my location'
                                }, void 0, false, {
                                    fileName: "[project]/OneDrive/Desktop/web/SafeSpeak/src/app/resources/page.tsx",
                                    lineNumber: 455,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "text-sm text-gray-600 flex-1",
                                    children: [
                                        statusMsg || 'No location set',
                                        userLoc && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: clearLocation,
                                            className: "ml-2 text-blue-600 hover:underline",
                                            "aria-label": "Clear location",
                                            children: "(clear)"
                                        }, void 0, false, {
                                            fileName: "[project]/OneDrive/Desktop/web/SafeSpeak/src/app/resources/page.tsx",
                                            lineNumber: 467,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/OneDrive/Desktop/web/SafeSpeak/src/app/resources/page.tsx",
                                    lineNumber: 464,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                    value: Number.isFinite(radius) ? radius : 'all',
                                    onChange: (e)=>setRadius(e.target.value === 'all' ? Infinity : Number(e.target.value)),
                                    className: "px-3 py-2 border border-gray-300 rounded-md text-sm",
                                    "aria-label": "Search radius",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                            value: "all",
                                            children: "All"
                                        }, void 0, false, {
                                            fileName: "[project]/OneDrive/Desktop/web/SafeSpeak/src/app/resources/page.tsx",
                                            lineNumber: 483,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                            value: 5,
                                            children: "5 km"
                                        }, void 0, false, {
                                            fileName: "[project]/OneDrive/Desktop/web/SafeSpeak/src/app/resources/page.tsx",
                                            lineNumber: 484,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                            value: 10,
                                            children: "10 km"
                                        }, void 0, false, {
                                            fileName: "[project]/OneDrive/Desktop/web/SafeSpeak/src/app/resources/page.tsx",
                                            lineNumber: 485,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                            value: 25,
                                            children: "25 km"
                                        }, void 0, false, {
                                            fileName: "[project]/OneDrive/Desktop/web/SafeSpeak/src/app/resources/page.tsx",
                                            lineNumber: 486,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                            value: 50,
                                            children: "50 km"
                                        }, void 0, false, {
                                            fileName: "[project]/OneDrive/Desktop/web/SafeSpeak/src/app/resources/page.tsx",
                                            lineNumber: 487,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                            value: 100,
                                            children: "100 km"
                                        }, void 0, false, {
                                            fileName: "[project]/OneDrive/Desktop/web/SafeSpeak/src/app/resources/page.tsx",
                                            lineNumber: 488,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/OneDrive/Desktop/web/SafeSpeak/src/app/resources/page.tsx",
                                    lineNumber: 477,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/OneDrive/Desktop/web/SafeSpeak/src/app/resources/page.tsx",
                            lineNumber: 454,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/OneDrive/Desktop/web/SafeSpeak/src/app/resources/page.tsx",
                        lineNumber: 453,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/OneDrive/Desktop/web/SafeSpeak/src/app/resources/page.tsx",
                lineNumber: 449,
                columnNumber: 7
            }, this),
            modal.isOpen && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50",
                onClick: (e)=>e.target === e.currentTarget && setModal((prev)=>({
                            ...prev,
                            isOpen: false
                        })),
                role: "dialog",
                "aria-modal": "true",
                "aria-labelledby": "city-modal-title",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "bg-white rounded-lg p-6 w-full max-w-md",
                    onClick: (e)=>e.stopPropagation(),
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                            id: "city-modal-title",
                            className: "text-xl font-semibold mb-4",
                            children: "Find help near you"
                        }, void 0, false, {
                            fileName: "[project]/OneDrive/Desktop/web/SafeSpeak/src/app/resources/page.tsx",
                            lineNumber: 504,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "space-y-4",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            htmlFor: "city-input",
                                            className: "block text-sm font-medium text-gray-700 mb-1",
                                            children: "Enter your city"
                                        }, void 0, false, {
                                            fileName: "[project]/OneDrive/Desktop/web/SafeSpeak/src/app/resources/page.tsx",
                                            lineNumber: 508,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            id: "city-input",
                                            type: "text",
                                            value: modal.cityInput,
                                            onChange: (e)=>setModal((prev)=>({
                                                        ...prev,
                                                        cityInput: e.target.value,
                                                        error: undefined
                                                    })),
                                            placeholder: "E.g., Delhi, Mumbai",
                                            className: "w-full px-3 py-2 border border-gray-300 rounded-md text-sm",
                                            list: "cities",
                                            "aria-describedby": "city-hint"
                                        }, void 0, false, {
                                            fileName: "[project]/OneDrive/Desktop/web/SafeSpeak/src/app/resources/page.tsx",
                                            lineNumber: 511,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("datalist", {
                                            id: "cities",
                                            children: [
                                                'Delhi',
                                                'Mumbai',
                                                'Chennai',
                                                'Hyderabad'
                                            ].map((city)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                    value: city
                                                }, city, false, {
                                                    fileName: "[project]/OneDrive/Desktop/web/SafeSpeak/src/app/resources/page.tsx",
                                                    lineNumber: 523,
                                                    columnNumber: 21
                                                }, this))
                                        }, void 0, false, {
                                            fileName: "[project]/OneDrive/Desktop/web/SafeSpeak/src/app/resources/page.tsx",
                                            lineNumber: 521,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            id: "city-hint",
                                            className: "mt-1 text-xs text-gray-500",
                                            children: "Suggestions: Delhi, Mumbai, Chennai, Hyderabad, or any city name"
                                        }, void 0, false, {
                                            fileName: "[project]/OneDrive/Desktop/web/SafeSpeak/src/app/resources/page.tsx",
                                            lineNumber: 526,
                                            columnNumber: 17
                                        }, this),
                                        geocoding && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "mt-1 text-xs text-blue-600",
                                            children: "Searching..."
                                        }, void 0, false, {
                                            fileName: "[project]/OneDrive/Desktop/web/SafeSpeak/src/app/resources/page.tsx",
                                            lineNumber: 530,
                                            columnNumber: 19
                                        }, this),
                                        geocodedCity && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "mt-1 text-xs text-green-600",
                                            children: [
                                                "✓ Found: ",
                                                geocodedCity.name
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/OneDrive/Desktop/web/SafeSpeak/src/app/resources/page.tsx",
                                            lineNumber: 533,
                                            columnNumber: 19
                                        }, this),
                                        modal.error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "mt-1 text-sm text-red-600",
                                            children: modal.error
                                        }, void 0, false, {
                                            fileName: "[project]/OneDrive/Desktop/web/SafeSpeak/src/app/resources/page.tsx",
                                            lineNumber: 538,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "mt-2 text-xs text-gray-500 italic",
                                            children: "May be approximate; we only store coarse location (~110m precision)."
                                        }, void 0, false, {
                                            fileName: "[project]/OneDrive/Desktop/web/SafeSpeak/src/app/resources/page.tsx",
                                            lineNumber: 540,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/OneDrive/Desktop/web/SafeSpeak/src/app/resources/page.tsx",
                                    lineNumber: 507,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex justify-end gap-3 pt-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: ()=>setModal((prev)=>({
                                                        ...prev,
                                                        isOpen: false
                                                    })),
                                            className: "px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-md border border-gray-300",
                                            children: "Cancel"
                                        }, void 0, false, {
                                            fileName: "[project]/OneDrive/Desktop/web/SafeSpeak/src/app/resources/page.tsx",
                                            lineNumber: 546,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: handleCitySubmit,
                                            disabled: !modal.cityInput.trim(),
                                            className: "px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-blue-300 transition-colors",
                                            children: "Use city"
                                        }, void 0, false, {
                                            fileName: "[project]/OneDrive/Desktop/web/SafeSpeak/src/app/resources/page.tsx",
                                            lineNumber: 552,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/OneDrive/Desktop/web/SafeSpeak/src/app/resources/page.tsx",
                                    lineNumber: 545,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/OneDrive/Desktop/web/SafeSpeak/src/app/resources/page.tsx",
                            lineNumber: 506,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/OneDrive/Desktop/web/SafeSpeak/src/app/resources/page.tsx",
                    lineNumber: 503,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/OneDrive/Desktop/web/SafeSpeak/src/app/resources/page.tsx",
                lineNumber: 496,
                columnNumber: 9
            }, this),
            loading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "text-center py-8",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"
                    }, void 0, false, {
                        fileName: "[project]/OneDrive/Desktop/web/SafeSpeak/src/app/resources/page.tsx",
                        lineNumber: 568,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "mt-2 text-gray-600",
                        children: "Loading resources…"
                    }, void 0, false, {
                        fileName: "[project]/OneDrive/Desktop/web/SafeSpeak/src/app/resources/page.tsx",
                        lineNumber: 569,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/OneDrive/Desktop/web/SafeSpeak/src/app/resources/page.tsx",
                lineNumber: 567,
                columnNumber: 9
            }, this) : filteredItems.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "text-center py-8 bg-white rounded-lg border border-gray-200",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-gray-600",
                        children: [
                            "No NGOs found within ",
                            radius,
                            " km."
                        ]
                    }, void 0, true, {
                        fileName: "[project]/OneDrive/Desktop/web/SafeSpeak/src/app/resources/page.tsx",
                        lineNumber: 573,
                        columnNumber: 11
                    }, this),
                    radius < 1000 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>setRadius(1000),
                        className: "mt-2 text-blue-600 hover:underline text-sm",
                        children: "Show all NGOs"
                    }, void 0, false, {
                        fileName: "[project]/OneDrive/Desktop/web/SafeSpeak/src/app/resources/page.tsx",
                        lineNumber: 575,
                        columnNumber: 13
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/OneDrive/Desktop/web/SafeSpeak/src/app/resources/page.tsx",
                lineNumber: 572,
                columnNumber: 9
            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "space-y-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "bg-gray-50 border border-gray-200 rounded-lg p-3 flex flex-wrap items-center gap-3 text-sm",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "font-medium text-gray-700",
                                        children: "Show:"
                                    }, void 0, false, {
                                        fileName: "[project]/OneDrive/Desktop/web/SafeSpeak/src/app/resources/page.tsx",
                                        lineNumber: 588,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                        value: Number.isFinite(perPage) ? perPage : 'all',
                                        onChange: (e)=>setPerPage(e.target.value === 'all' ? Infinity : Number(e.target.value)),
                                        className: "px-2 py-1 border border-gray-300 rounded text-sm",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: "all",
                                                children: "All"
                                            }, void 0, false, {
                                                fileName: "[project]/OneDrive/Desktop/web/SafeSpeak/src/app/resources/page.tsx",
                                                lineNumber: 594,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: 25,
                                                children: "25"
                                            }, void 0, false, {
                                                fileName: "[project]/OneDrive/Desktop/web/SafeSpeak/src/app/resources/page.tsx",
                                                lineNumber: 595,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: 50,
                                                children: "50"
                                            }, void 0, false, {
                                                fileName: "[project]/OneDrive/Desktop/web/SafeSpeak/src/app/resources/page.tsx",
                                                lineNumber: 596,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: 100,
                                                children: "100"
                                            }, void 0, false, {
                                                fileName: "[project]/OneDrive/Desktop/web/SafeSpeak/src/app/resources/page.tsx",
                                                lineNumber: 597,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/OneDrive/Desktop/web/SafeSpeak/src/app/resources/page.tsx",
                                        lineNumber: 589,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/OneDrive/Desktop/web/SafeSpeak/src/app/resources/page.tsx",
                                lineNumber: 587,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-gray-600",
                                children: [
                                    "Showing ",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "font-semibold text-gray-900",
                                        children: visibleItems.length
                                    }, void 0, false, {
                                        fileName: "[project]/OneDrive/Desktop/web/SafeSpeak/src/app/resources/page.tsx",
                                        lineNumber: 602,
                                        columnNumber: 23
                                    }, this),
                                    " of",
                                    ' ',
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "font-semibold text-gray-900",
                                        children: filteredItems.length
                                    }, void 0, false, {
                                        fileName: "[project]/OneDrive/Desktop/web/SafeSpeak/src/app/resources/page.tsx",
                                        lineNumber: 603,
                                        columnNumber: 15
                                    }, this),
                                    filteredItems.length !== items.length && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: [
                                            " (Total: ",
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "font-semibold text-gray-900",
                                                children: items.length
                                            }, void 0, false, {
                                                fileName: "[project]/OneDrive/Desktop/web/SafeSpeak/src/app/resources/page.tsx",
                                                lineNumber: 605,
                                                columnNumber: 32
                                            }, this),
                                            ")"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/OneDrive/Desktop/web/SafeSpeak/src/app/resources/page.tsx",
                                        lineNumber: 605,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/OneDrive/Desktop/web/SafeSpeak/src/app/resources/page.tsx",
                                lineNumber: 601,
                                columnNumber: 13
                            }, this),
                            lastUpdated && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-xs text-gray-500 ml-auto",
                                children: [
                                    "Updated ",
                                    Math.floor((Date.now() - lastUpdated) / 60000),
                                    " min ago",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>{
                                            localStorage.removeItem('resourcesCache');
                                            window.location.reload();
                                        },
                                        className: "ml-2 text-blue-600 hover:underline",
                                        children: "Clear cache"
                                    }, void 0, false, {
                                        fileName: "[project]/OneDrive/Desktop/web/SafeSpeak/src/app/resources/page.tsx",
                                        lineNumber: 612,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/OneDrive/Desktop/web/SafeSpeak/src/app/resources/page.tsx",
                                lineNumber: 610,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/OneDrive/Desktop/web/SafeSpeak/src/app/resources/page.tsx",
                        lineNumber: 586,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mb-6",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                className: "text-2xl font-bold text-gray-900",
                                children: [
                                    filteredItems.length,
                                    " ",
                                    filteredItems.length === 1 ? 'Resource' : 'Resources',
                                    " Found"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/OneDrive/Desktop/web/SafeSpeak/src/app/resources/page.tsx",
                                lineNumber: 627,
                                columnNumber: 13
                            }, this),
                            userLoc && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-sm text-gray-600 mt-1",
                                children: "Showing results near your location"
                            }, void 0, false, {
                                fileName: "[project]/OneDrive/Desktop/web/SafeSpeak/src/app/resources/page.tsx",
                                lineNumber: 631,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/OneDrive/Desktop/web/SafeSpeak/src/app/resources/page.tsx",
                        lineNumber: 626,
                        columnNumber: 11
                    }, this),
                    userLoc && filteredItems.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mb-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                className: "text-lg font-semibold text-gray-900 mb-4 flex items-center",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                        className: "w-5 h-5 mr-2 text-blue-600",
                                        fill: "currentColor",
                                        viewBox: "0 0 20 20",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                            fillRule: "evenodd",
                                            d: "M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z",
                                            clipRule: "evenodd"
                                        }, void 0, false, {
                                            fileName: "[project]/OneDrive/Desktop/web/SafeSpeak/src/app/resources/page.tsx",
                                            lineNumber: 642,
                                            columnNumber: 19
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/OneDrive/Desktop/web/SafeSpeak/src/app/resources/page.tsx",
                                        lineNumber: 641,
                                        columnNumber: 17
                                    }, this),
                                    "Top 5 Nearest Resources"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/OneDrive/Desktop/web/SafeSpeak/src/app/resources/page.tsx",
                                lineNumber: 640,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "space-y-3",
                                children: filteredItems.slice(0, 5).map((ngo, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow border border-gray-200",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex items-start gap-3",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex-shrink-0",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center text-white font-bold shadow-lg",
                                                        children: index + 1
                                                    }, void 0, false, {
                                                        fileName: "[project]/OneDrive/Desktop/web/SafeSpeak/src/app/resources/page.tsx",
                                                        lineNumber: 651,
                                                        columnNumber: 25
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/OneDrive/Desktop/web/SafeSpeak/src/app/resources/page.tsx",
                                                    lineNumber: 650,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex-1 min-w-0",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex items-center gap-2 mb-1",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                                    className: "font-semibold text-gray-900 truncate",
                                                                    children: ngo.name
                                                                }, void 0, false, {
                                                                    fileName: "[project]/OneDrive/Desktop/web/SafeSpeak/src/app/resources/page.tsx",
                                                                    lineNumber: 657,
                                                                    columnNumber: 27
                                                                }, this),
                                                                ngo.verified && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "px-2 py-0.5 text-xs font-medium rounded-full bg-emerald-100 text-emerald-800 flex-shrink-0",
                                                                    children: "✓ Verified"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/OneDrive/Desktop/web/SafeSpeak/src/app/resources/page.tsx",
                                                                    lineNumber: 659,
                                                                    columnNumber: 29
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/OneDrive/Desktop/web/SafeSpeak/src/app/resources/page.tsx",
                                                            lineNumber: 656,
                                                            columnNumber: 25
                                                        }, this),
                                                        ngo.distanceKm !== undefined && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "text-sm text-gray-600 mb-2",
                                                            children: [
                                                                "📍 ",
                                                                (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$src$2f$lib$2f$geo$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatDistance"])(ngo.distanceKm),
                                                                " away"
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/OneDrive/Desktop/web/SafeSpeak/src/app/resources/page.tsx",
                                                            lineNumber: 665,
                                                            columnNumber: 27
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex flex-wrap gap-2",
                                                            children: [
                                                                ngo.contact && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                                                    href: `tel:${ngo.contact}`,
                                                                    className: "inline-flex items-center px-3 py-1.5 text-xs font-medium text-blue-700 bg-blue-100 rounded-lg hover:bg-blue-200 transition-colors",
                                                                    children: "📞 Call Now"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/OneDrive/Desktop/web/SafeSpeak/src/app/resources/page.tsx",
                                                                    lineNumber: 671,
                                                                    columnNumber: 29
                                                                }, this),
                                                                ngo.lat && ngo.lng && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                                                    href: `https://www.google.com/maps/search/?api=1&query=${ngo.lat},${ngo.lng}`,
                                                                    target: "_blank",
                                                                    rel: "noopener noreferrer",
                                                                    className: "inline-flex items-center px-3 py-1.5 text-xs font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors",
                                                                    children: "🗺️ Directions"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/OneDrive/Desktop/web/SafeSpeak/src/app/resources/page.tsx",
                                                                    lineNumber: 679,
                                                                    columnNumber: 29
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/OneDrive/Desktop/web/SafeSpeak/src/app/resources/page.tsx",
                                                            lineNumber: 669,
                                                            columnNumber: 25
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/OneDrive/Desktop/web/SafeSpeak/src/app/resources/page.tsx",
                                                    lineNumber: 655,
                                                    columnNumber: 23
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/OneDrive/Desktop/web/SafeSpeak/src/app/resources/page.tsx",
                                            lineNumber: 649,
                                            columnNumber: 21
                                        }, this)
                                    }, ngo.id, false, {
                                        fileName: "[project]/OneDrive/Desktop/web/SafeSpeak/src/app/resources/page.tsx",
                                        lineNumber: 648,
                                        columnNumber: 19
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/OneDrive/Desktop/web/SafeSpeak/src/app/resources/page.tsx",
                                lineNumber: 646,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/OneDrive/Desktop/web/SafeSpeak/src/app/resources/page.tsx",
                        lineNumber: 639,
                        columnNumber: 13
                    }, this),
                    filteredItems.some((ngo)=>ngo.lat !== null && ngo.lng !== null) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mb-8",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                className: "text-lg font-semibold text-gray-900 mb-4 flex items-center",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                        className: "w-5 h-5 mr-2 text-green-600",
                                        fill: "currentColor",
                                        viewBox: "0 0 20 20",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                            fillRule: "evenodd",
                                            d: "M12 1.586l-4 4v12.828l4-4V1.586zM3.707 3.293A1 1 0 002 4v10a1 1 0 00.293.707L6 18.414V5.586L3.707 3.293zM17.707 5.293L14 1.586v12.828l2.293 2.293A1 1 0 0018 16V6a1 1 0 00-.293-.707z",
                                            clipRule: "evenodd"
                                        }, void 0, false, {
                                            fileName: "[project]/OneDrive/Desktop/web/SafeSpeak/src/app/resources/page.tsx",
                                            lineNumber: 702,
                                            columnNumber: 19
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/OneDrive/Desktop/web/SafeSpeak/src/app/resources/page.tsx",
                                        lineNumber: 701,
                                        columnNumber: 17
                                    }, this),
                                    "Interactive Map View"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/OneDrive/Desktop/web/SafeSpeak/src/app/resources/page.tsx",
                                lineNumber: 700,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ResourcesMap, {
                                ngos: filteredItems.filter((ngo)=>ngo.lat !== null && ngo.lng !== null).map((ngo)=>({
                                        id: ngo.id,
                                        name: ngo.name,
                                        lat: ngo.lat,
                                        lng: ngo.lng,
                                        verified: ngo.verified,
                                        contact: ngo.contact,
                                        distanceKm: ngo.distanceKm
                                    })),
                                userLocation: userLoc
                            }, void 0, false, {
                                fileName: "[project]/OneDrive/Desktop/web/SafeSpeak/src/app/resources/page.tsx",
                                lineNumber: 706,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/OneDrive/Desktop/web/SafeSpeak/src/app/resources/page.tsx",
                        lineNumber: 699,
                        columnNumber: 13
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$src$2f$components$2f$ui$2f$masonry$2d$grid$2d$with$2d$scroll$2d$animation$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MasonryGrid"], {
                        items: masonryItems
                    }, void 0, false, {
                        fileName: "[project]/OneDrive/Desktop/web/SafeSpeak/src/app/resources/page.tsx",
                        lineNumber: 724,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/OneDrive/Desktop/web/SafeSpeak/src/app/resources/page.tsx",
                lineNumber: 584,
                columnNumber: 9
            }, this),
            showToast && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$src$2f$components$2f$LocationToast$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                message: toastMessage,
                onClear: userLoc ? clearLocation : undefined,
                onDismiss: ()=>setShowToast(false)
            }, void 0, false, {
                fileName: "[project]/OneDrive/Desktop/web/SafeSpeak/src/app/resources/page.tsx",
                lineNumber: 730,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/OneDrive/Desktop/web/SafeSpeak/src/app/resources/page.tsx",
        lineNumber: 407,
        columnNumber: 5
    }, this);
}
_s(Resources, "8ZIp5fzSV0bYzzXO2UpcpuqOops=");
_c1 = Resources;
var _c, _c1;
__turbopack_context__.k.register(_c, "ResourcesMap");
__turbopack_context__.k.register(_c1, "Resources");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=OneDrive_Desktop_web_SafeSpeak_src_6c6f9307._.js.map