const withPWA = require("next-pwa")({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
});

const csp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' blob: https://www.gstatic.com",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "img-src 'self' data: blob: https://*.tile.openstreetmap.org https://tile.openstreetmap.org https://unpkg.com/leaflet@1.9.4/dist/images/ https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/",
  "connect-src 'self' https://*.supabase.co wss://firestore.googleapis.com https://firestore.googleapis.com https://api.deepseek.com https://identitytoolkit.googleapis.com https://securetoken.googleapis.com https://*.tile.openstreetmap.org https://tile.openstreetmap.org https://nominatim.openstreetmap.org https://overpass-api.de https://overpass.kumi.systems",
  "font-src 'self' https://fonts.gstatic.com",
  "frame-ancestors 'self'",
  "base-uri 'self'",
  "form-action 'self'"
].join('; ');

const securityHeaders = [
  {
    key: "Content-Security-Policy",
    value: csp,
  },
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "X-Frame-Options",
    value: "DENY",
  },
  {
    key: "Permissions-Policy",
    value: "camera=(self), microphone=(), geolocation=(self)",
  },
  {
    key: "Cross-Origin-Resource-Policy",
    value: "same-origin",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
];

const baseConfig = {
  reactStrictMode: true,
  experimental: {
    // Fix for Next.js 14+ module resolution issues
    esmExternals: 'loose',
    serverComponentsExternalPackages: ['@tensorflow/tfjs', '@tensorflow-models/blazeface'],
    serverActions: {
      bodySizeLimit: "2mb"
    }
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
  headers: async () => [
    {
      source: "/(.*)",
      headers: securityHeaders,
    },
  ],
};

module.exports = withPWA(baseConfig);
