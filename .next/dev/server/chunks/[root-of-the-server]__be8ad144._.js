module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/firebase-admin/app [external] (firebase-admin/app, esm_import)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

const mod = await __turbopack_context__.y("firebase-admin/app");

__turbopack_context__.n(mod);
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, true);}),
"[externals]/firebase-admin/firestore [external] (firebase-admin/firestore, esm_import)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

const mod = await __turbopack_context__.y("firebase-admin/firestore");

__turbopack_context__.n(mod);
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, true);}),
"[project]/OneDrive/Desktop/web/SafeSpeak/src/lib/admin.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "getAdminApp",
    ()=>getAdminApp,
    "getAdminDb",
    ()=>getAdminDb
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$firebase$2d$admin$2f$app__$5b$external$5d$__$28$firebase$2d$admin$2f$app$2c$__esm_import$29$__ = __turbopack_context__.i("[externals]/firebase-admin/app [external] (firebase-admin/app, esm_import)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$firebase$2d$admin$2f$firestore__$5b$external$5d$__$28$firebase$2d$admin$2f$firestore$2c$__esm_import$29$__ = __turbopack_context__.i("[externals]/firebase-admin/firestore [external] (firebase-admin/firestore, esm_import)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$externals$5d2f$firebase$2d$admin$2f$app__$5b$external$5d$__$28$firebase$2d$admin$2f$app$2c$__esm_import$29$__,
    __TURBOPACK__imported__module__$5b$externals$5d2f$firebase$2d$admin$2f$firestore__$5b$external$5d$__$28$firebase$2d$admin$2f$firestore$2c$__esm_import$29$__
]);
[__TURBOPACK__imported__module__$5b$externals$5d2f$firebase$2d$admin$2f$app__$5b$external$5d$__$28$firebase$2d$admin$2f$app$2c$__esm_import$29$__, __TURBOPACK__imported__module__$5b$externals$5d2f$firebase$2d$admin$2f$firestore__$5b$external$5d$__$28$firebase$2d$admin$2f$firestore$2c$__esm_import$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
let cachedApp;
function parseServiceAccount() {
    const raw = process.env.FIREBASE_SERVICE_ACCOUNT;
    if (!raw) {
        throw new Error("FIREBASE_SERVICE_ACCOUNT environment variable is not set.");
    }
    try {
        const parsed = JSON.parse(raw);
        if (!parsed.project_id || !parsed.client_email || !parsed.private_key) {
            throw new Error("Missing required fields in service account JSON.");
        }
        return parsed;
    } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        throw new Error(`Failed to parse FIREBASE_SERVICE_ACCOUNT: ${message}`);
    }
}
function getAdminApp() {
    if (cachedApp) {
        return cachedApp;
    }
    if ((0, __TURBOPACK__imported__module__$5b$externals$5d2f$firebase$2d$admin$2f$app__$5b$external$5d$__$28$firebase$2d$admin$2f$app$2c$__esm_import$29$__["getApps"])().length > 0) {
        cachedApp = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$firebase$2d$admin$2f$app__$5b$external$5d$__$28$firebase$2d$admin$2f$app$2c$__esm_import$29$__["getApps"])()[0];
        return cachedApp;
    }
    const serviceAccount = parseServiceAccount();
    cachedApp = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$firebase$2d$admin$2f$app__$5b$external$5d$__$28$firebase$2d$admin$2f$app$2c$__esm_import$29$__["initializeApp"])({
        credential: (0, __TURBOPACK__imported__module__$5b$externals$5d2f$firebase$2d$admin$2f$app__$5b$external$5d$__$28$firebase$2d$admin$2f$app$2c$__esm_import$29$__["cert"])(serviceAccount)
    });
    return cachedApp;
}
function getAdminDb() {
    const app = getAdminApp();
    return (0, __TURBOPACK__imported__module__$5b$externals$5d2f$firebase$2d$admin$2f$firestore__$5b$external$5d$__$28$firebase$2d$admin$2f$firestore$2c$__esm_import$29$__["getFirestore"])(app);
}
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/OneDrive/Desktop/web/SafeSpeak/src/app/api/resources/near/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "GET",
    ()=>GET
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/web/SafeSpeak/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$src$2f$lib$2f$admin$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/web/SafeSpeak/src/lib/admin.ts [app-route] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$src$2f$lib$2f$admin$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$src$2f$lib$2f$admin$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
const GEOCODE_CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours
const GEOCODE_USER_AGENT = process.env.NOMINATIM_USER_AGENT || "SafeSpeak/1.0 (contact@safespeak.example)";
const geocodeCache = new Map();
async function GET(request) {
    const url = new URL(request.url);
    const latParam = url.searchParams.get("lat");
    const lngParam = url.searchParams.get("lng");
    if (!latParam || !lngParam) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "lat and lng query parameters are required"
        }, {
            status: 400
        });
    }
    const userLat = Number(latParam);
    const userLng = Number(lngParam);
    if (!Number.isFinite(userLat) || !Number.isFinite(userLng)) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "lat and lng must be valid numbers"
        }, {
            status: 400
        });
    }
    const radiusParam = url.searchParams.get("radiusKm");
    const limitParam = url.searchParams.get("limit");
    const cityParam = normalizeOptionalString(url.searchParams.get("city"));
    const normalizedCityKey = cityParam ? normalizeKey(cityParam) : null;
    const radiusKm = parseRadius(radiusParam);
    const radiusLimit = Number.isFinite(radiusKm) ? radiusKm : Number.POSITIVE_INFINITY;
    const rawLimit = limitParam ? Number(limitParam) : undefined;
    const limit = Number.isFinite(rawLimit) && rawLimit > 0 ? Math.min(Math.floor(rawLimit), 100) : 20;
    try {
        const db = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$src$2f$lib$2f$admin$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getAdminDb"])();
        const snapshot = await db.collection("ngos").get();
        const ngos = (await Promise.all(snapshot.docs.map(async (doc)=>{
            const data = doc.data();
            if (!data) {
                return null;
            }
            const region = normalizeOptionalString(data.region);
            const state = normalizeOptionalString(data.state);
            const name = typeof data.name === "string" ? data.name : "";
            const contact = normalizeOptionalString(data.contact);
            const services = normalizeStrings(data.services);
            const languages = normalizeStrings(data.languages);
            const verified = normalizeBoolean(data.verified);
            let lat = coerceNumber(data.lat);
            let lng = coerceNumber(data.lng);
            let approx = false;
            if (lat === null || lng === null) {
                if (region && normalizedCityKey && normalizeKey(region) === normalizedCityKey) {
                    lat = userLat;
                    lng = userLng;
                    approx = true;
                } else {
                    const fallbackCoords = await geocodeWithFallback(region, state);
                    if (fallbackCoords) {
                        lat = fallbackCoords.lat;
                        lng = fallbackCoords.lng;
                        approx = true;
                    }
                }
            }
            if (lat === null || lng === null) {
                return null;
            }
            const distanceKm = haversineKm({
                lat: userLat,
                lng: userLng
            }, {
                lat,
                lng
            });
            if (!Number.isFinite(distanceKm)) {
                return null;
            }
            if (distanceKm > radiusLimit) {
                return null;
            }
            return {
                id: doc.id,
                name,
                services,
                languages,
                verified,
                contact,
                region,
                state,
                lat,
                lng,
                approx,
                distanceKm
            };
        }))).filter((ngo)=>ngo !== null).sort((a, b)=>a.distanceKm - b.distanceKm).slice(0, limit);
        return __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(ngos, {
            status: 200
        });
    } catch (error) {
        console.error("Resources near route error:", error instanceof Error ? error.message : error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "server error"
        }, {
            status: 500
        });
    }
}
function parseRadius(value) {
    if (!value) {
        return 50; // default radius 50km
    }
    if (value.toLowerCase() === "all") {
        return Number.POSITIVE_INFINITY;
    }
    const parsed = Number(value);
    return Number.isFinite(parsed) && parsed >= 0 ? parsed : 50;
}
function normalizeKey(value) {
    return value.toLowerCase().replace(/\s+/g, "");
}
function coerceNumber(value) {
    if (typeof value === "number" && Number.isFinite(value)) {
        return value;
    }
    if (typeof value === "string") {
        const parsed = Number(value);
        if (Number.isFinite(parsed)) {
            return parsed;
        }
    }
    return null;
}
function normalizeStrings(value) {
    if (!Array.isArray(value)) {
        return [];
    }
    return value.map((entry)=>typeof entry === "string" ? entry : null).filter((entry)=>entry !== null).map((entry)=>entry.trim()).filter((entry)=>entry.length > 0);
}
function normalizeBoolean(value) {
    if (typeof value === "boolean") {
        return value;
    }
    if (typeof value === "string") {
        const normalized = value.trim().toLowerCase();
        return normalized === "true" || normalized === "1" || normalized === "yes";
    }
    return false;
}
function normalizeOptionalString(value) {
    if (typeof value === "string") {
        const trimmed = value.trim();
        if (trimmed.length > 0) {
            return trimmed;
        }
    }
    return undefined;
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
    return Math.round(distance * 10) / 10;
}
function toRad(degrees) {
    return degrees * Math.PI / 180;
}
async function geocodeWithFallback(region, state) {
    const attempts = [];
    if (region && state) {
        attempts.push(`${region}, ${state}, India`);
    }
    if (region) {
        attempts.push(`${region}, India`);
    }
    if (state) {
        attempts.push(`${state}, India`);
    }
    for (const query of attempts){
        const coords = await geocodeCached(query);
        if (coords) {
            return coords;
        }
    }
    return null;
}
async function geocodeCached(query) {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) {
        return null;
    }
    const cached = geocodeCache.get(normalizedQuery);
    if (cached && cached.expiresAt > Date.now()) {
        return cached.coords;
    }
    try {
        const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(query)}`;
        const response = await fetch(url, {
            headers: {
                "User-Agent": GEOCODE_USER_AGENT,
                "Accept-Language": "en"
            }
        });
        if (!response.ok) {
            console.warn(`Geocode request failed (${response.status}) for query: ${query}`);
            geocodeCache.set(normalizedQuery, {
                coords: null,
                expiresAt: Date.now() + GEOCODE_CACHE_TTL_MS
            });
            return null;
        }
        const data = await response.json();
        if (!Array.isArray(data) || data.length === 0) {
            geocodeCache.set(normalizedQuery, {
                coords: null,
                expiresAt: Date.now() + GEOCODE_CACHE_TTL_MS
            });
            return null;
        }
        const lat = Number(data[0].lat);
        const lng = Number(data[0].lon);
        if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
            geocodeCache.set(normalizedQuery, {
                coords: null,
                expiresAt: Date.now() + GEOCODE_CACHE_TTL_MS
            });
            return null;
        }
        const coords = {
            lat,
            lng
        };
        geocodeCache.set(normalizedQuery, {
            coords,
            expiresAt: Date.now() + GEOCODE_CACHE_TTL_MS
        });
        return coords;
    } catch (error) {
        console.warn("Geocode request error for query", query, error instanceof Error ? error.message : error);
        geocodeCache.set(normalizedQuery, {
            coords: null,
            expiresAt: Date.now() + GEOCODE_CACHE_TTL_MS
        });
        return null;
    }
}
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__be8ad144._.js.map