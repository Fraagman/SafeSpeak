(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/OneDrive/Desktop/web/SafeSpeak/src/components/ResourcesMap.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ResourcesMap
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/web/SafeSpeak/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/web/SafeSpeak/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$node_modules$2f$react$2d$leaflet$2f$lib$2f$MapContainer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/web/SafeSpeak/node_modules/react-leaflet/lib/MapContainer.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$node_modules$2f$react$2d$leaflet$2f$lib$2f$TileLayer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/web/SafeSpeak/node_modules/react-leaflet/lib/TileLayer.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$node_modules$2f$react$2d$leaflet$2f$lib$2f$Marker$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/web/SafeSpeak/node_modules/react-leaflet/lib/Marker.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$node_modules$2f$react$2d$leaflet$2f$lib$2f$Popup$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/web/SafeSpeak/node_modules/react-leaflet/lib/Popup.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$node_modules$2f$react$2d$leaflet$2f$lib$2f$Circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/web/SafeSpeak/node_modules/react-leaflet/lib/Circle.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$node_modules$2f$react$2d$leaflet$2f$lib$2f$hooks$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/web/SafeSpeak/node_modules/react-leaflet/lib/hooks.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$node_modules$2f$leaflet$2f$dist$2f$leaflet$2d$src$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/web/SafeSpeak/node_modules/leaflet/dist/leaflet-src.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$src$2f$lib$2f$geo$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/web/SafeSpeak/src/lib/geo.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
"use client";
;
;
;
;
// Fix for default marker icons in Next.js
delete __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$node_modules$2f$leaflet$2f$dist$2f$leaflet$2d$src$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].Icon.Default.prototype._getIconUrl;
__TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$node_modules$2f$leaflet$2f$dist$2f$leaflet$2d$src$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].Icon.Default.mergeOptions({
    iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png"
});
// Custom pink marker for NGOs
const ngoIcon = new __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$node_modules$2f$leaflet$2f$dist$2f$leaflet$2d$src$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].Icon({
    iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-pink.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    iconSize: [
        25,
        41
    ],
    iconAnchor: [
        12,
        41
    ],
    popupAnchor: [
        1,
        -34
    ],
    shadowSize: [
        41,
        41
    ]
});
function CaptureMap({ onMap }) {
    _s();
    const map = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$node_modules$2f$react$2d$leaflet$2f$lib$2f$hooks$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMap"])();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "CaptureMap.useEffect": ()=>{
            onMap(map);
        }
    }["CaptureMap.useEffect"], [
        map,
        onMap
    ]);
    return null;
}
_s(CaptureMap, "IoceErwr5KVGS9kN4RQ1bOkYMAg=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$node_modules$2f$react$2d$leaflet$2f$lib$2f$hooks$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMap"]
    ];
});
_c = CaptureMap;
function ResourcesMap({ ngos, userLocation, selectedNgoId, onMarkerClick }) {
    _s1();
    const mapRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const markerRefs = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(new Map());
    // Get top 5 NGOs based on user location
    const top5Ngos = userLocation ? [
        ...ngos
    ].sort((a, b)=>(a.distanceKm || 0) - (b.distanceKm || 0)).slice(0, 5) : ngos.slice(0, 5);
    // Center map on user location or default to India
    const center = userLocation ? [
        userLocation.lat,
        userLocation.lng
    ] : [
        20.5937,
        78.9629
    ]; // Center of India
    const zoom = userLocation ? 11 : 5;
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ResourcesMap.useEffect": ()=>{
            return ({
                "ResourcesMap.useEffect": ()=>{
                    // Cleanup the map on unmount
                    if (mapRef.current) {
                        try {
                            mapRef.current.off();
                            mapRef.current.remove();
                        } catch (_) {
                        // ignore
                        }
                        mapRef.current = null;
                    }
                }
            })["ResourcesMap.useEffect"];
        }
    }["ResourcesMap.useEffect"], []);
    // Center and open popup for selected NGO
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ResourcesMap.useEffect": ()=>{
            if (selectedNgoId && mapRef.current) {
                const marker = markerRefs.current.get(selectedNgoId);
                const ngo = ngos.find({
                    "ResourcesMap.useEffect.ngo": (n)=>n.id === selectedNgoId
                }["ResourcesMap.useEffect.ngo"]);
                if (marker && ngo) {
                    mapRef.current.setView([
                        ngo.lat,
                        ngo.lng
                    ], 13, {
                        animate: true
                    });
                    marker.openPopup();
                }
            }
        }
    }["ResourcesMap.useEffect"], [
        selectedNgoId,
        ngos
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "w-full h-[60vh] rounded-lg overflow-hidden border border-gray-200",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$node_modules$2f$react$2d$leaflet$2f$lib$2f$MapContainer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MapContainer"], {
            center: center,
            zoom: zoom,
            scrollWheelZoom: true,
            className: "w-full h-full",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(CaptureMap, {
                    onMap: (map)=>{
                        mapRef.current = map;
                    }
                }, void 0, false, {
                    fileName: "[project]/OneDrive/Desktop/web/SafeSpeak/src/components/ResourcesMap.tsx",
                    lineNumber: 103,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$node_modules$2f$react$2d$leaflet$2f$lib$2f$TileLayer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TileLayer"], {
                    attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
                    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                }, void 0, false, {
                    fileName: "[project]/OneDrive/Desktop/web/SafeSpeak/src/components/ResourcesMap.tsx",
                    lineNumber: 104,
                    columnNumber: 7
                }, this),
                userLocation && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$node_modules$2f$react$2d$leaflet$2f$lib$2f$Circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Circle"], {
                            center: [
                                userLocation.lat,
                                userLocation.lng
                            ],
                            radius: 100,
                            pathOptions: {
                                color: "#3b82f6",
                                fillColor: "#3b82f6",
                                fillOpacity: 0.4
                            }
                        }, void 0, false, {
                            fileName: "[project]/OneDrive/Desktop/web/SafeSpeak/src/components/ResourcesMap.tsx",
                            lineNumber: 112,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$node_modules$2f$react$2d$leaflet$2f$lib$2f$Marker$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Marker"], {
                            position: [
                                userLocation.lat,
                                userLocation.lng
                            ],
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$node_modules$2f$react$2d$leaflet$2f$lib$2f$Popup$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Popup"], {
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "text-sm font-medium",
                                    children: "Your location"
                                }, void 0, false, {
                                    fileName: "[project]/OneDrive/Desktop/web/SafeSpeak/src/components/ResourcesMap.tsx",
                                    lineNumber: 123,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/OneDrive/Desktop/web/SafeSpeak/src/components/ResourcesMap.tsx",
                                lineNumber: 122,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/OneDrive/Desktop/web/SafeSpeak/src/components/ResourcesMap.tsx",
                            lineNumber: 121,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true),
                top5Ngos.map((ngo)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$node_modules$2f$react$2d$leaflet$2f$lib$2f$Marker$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Marker"], {
                        position: [
                            ngo.lat,
                            ngo.lng
                        ],
                        icon: ngoIcon,
                        ref: (ref)=>{
                            if (ref) markerRefs.current.set(ngo.id, ref);
                            else markerRefs.current.delete(ngo.id);
                        },
                        eventHandlers: {
                            click: ()=>{
                                if (onMarkerClick) {
                                    onMarkerClick(ngo.id);
                                }
                            }
                        },
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$node_modules$2f$react$2d$leaflet$2f$lib$2f$Popup$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Popup"], {
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "min-w-[200px]",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center gap-2 mb-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                className: "font-semibold text-gray-900",
                                                children: ngo.name
                                            }, void 0, false, {
                                                fileName: "[project]/OneDrive/Desktop/web/SafeSpeak/src/components/ResourcesMap.tsx",
                                                lineNumber: 150,
                                                columnNumber: 17
                                            }, this),
                                            ngo.verified && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "px-1.5 py-0.5 text-xs font-medium rounded-full bg-emerald-100 text-emerald-800",
                                                children: "✓"
                                            }, void 0, false, {
                                                fileName: "[project]/OneDrive/Desktop/web/SafeSpeak/src/components/ResourcesMap.tsx",
                                                lineNumber: 152,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/OneDrive/Desktop/web/SafeSpeak/src/components/ResourcesMap.tsx",
                                        lineNumber: 149,
                                        columnNumber: 15
                                    }, this),
                                    ngo.distanceKm !== undefined && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-sm text-gray-600 mb-2",
                                        children: [
                                            (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$src$2f$lib$2f$geo$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatDistance"])(ngo.distanceKm),
                                            " away"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/OneDrive/Desktop/web/SafeSpeak/src/components/ResourcesMap.tsx",
                                        lineNumber: 158,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex gap-2 mt-2",
                                        children: [
                                            ngo.contact && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                                href: `tel:${ngo.contact}`,
                                                className: "inline-block px-3 py-1 text-xs font-medium text-blue-700 bg-blue-100 rounded hover:bg-blue-200",
                                                children: "📞 Call"
                                            }, void 0, false, {
                                                fileName: "[project]/OneDrive/Desktop/web/SafeSpeak/src/components/ResourcesMap.tsx",
                                                lineNumber: 164,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                                href: `https://www.google.com/maps/search/?api=1&query=${ngo.lat},${ngo.lng}`,
                                                target: "_blank",
                                                rel: "noopener noreferrer",
                                                className: "inline-block px-3 py-1 text-xs font-medium text-gray-700 bg-gray-100 rounded hover:bg-gray-200",
                                                children: "🗺️ Open in Maps"
                                            }, void 0, false, {
                                                fileName: "[project]/OneDrive/Desktop/web/SafeSpeak/src/components/ResourcesMap.tsx",
                                                lineNumber: 171,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/OneDrive/Desktop/web/SafeSpeak/src/components/ResourcesMap.tsx",
                                        lineNumber: 162,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/OneDrive/Desktop/web/SafeSpeak/src/components/ResourcesMap.tsx",
                                lineNumber: 148,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/OneDrive/Desktop/web/SafeSpeak/src/components/ResourcesMap.tsx",
                            lineNumber: 147,
                            columnNumber: 11
                        }, this)
                    }, ngo.id, false, {
                        fileName: "[project]/OneDrive/Desktop/web/SafeSpeak/src/components/ResourcesMap.tsx",
                        lineNumber: 131,
                        columnNumber: 9
                    }, this))
            ]
        }, void 0, true, {
            fileName: "[project]/OneDrive/Desktop/web/SafeSpeak/src/components/ResourcesMap.tsx",
            lineNumber: 97,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/OneDrive/Desktop/web/SafeSpeak/src/components/ResourcesMap.tsx",
        lineNumber: 96,
        columnNumber: 5
    }, this);
}
_s1(ResourcesMap, "ddkSwbuaHicOnKaE9prodw56c9Q=");
_c1 = ResourcesMap;
var _c, _c1;
__turbopack_context__.k.register(_c, "CaptureMap");
__turbopack_context__.k.register(_c1, "ResourcesMap");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/OneDrive/Desktop/web/SafeSpeak/src/components/ResourcesMap.tsx [app-client] (ecmascript, next/dynamic entry)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/OneDrive/Desktop/web/SafeSpeak/src/components/ResourcesMap.tsx [app-client] (ecmascript)"));
}),
]);

//# sourceMappingURL=OneDrive_Desktop_web_SafeSpeak_src_components_ResourcesMap_tsx_0396ee52._.js.map