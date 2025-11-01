const withPWA = require("next-pwa")({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
});

const csp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' blob: https://www.gstatic.com",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "img-src 'self' data: blob: https://*.tile.openstreetmap.org https://tile.openstreetmap.org https://unpkg.com https://raw.githubusercontent.com",
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

const nextConfig = {
  reactStrictMode: false, // Disabled due to Leaflet map initialization issues
  // Enable webpack 5 for better compatibility with next-pwa
  webpack: (config, { isServer }) => {
    // Important: return the modified config
    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'unpkg.com',
      },
      {
        protocol: 'https',
        hostname: 'raw.githubusercontent.com',
      },
      {
        protocol: 'https',
        hostname: '*.tile.openstreetmap.org',
      }
    ]
  },
  // Turbopack configuration
  experimental: {
    // Disable Turbopack and use webpack
    turbo: false,
    // Server Actions configuration
    serverActions: {
      bodySizeLimit: "2mb"
    }
  },
  // External packages for server components
  serverExternalPackages: ['@tensorflow/tfjs', '@tensorflow-models/blazeface'],
  // Security headers
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
  // Disable ESLint during builds (use separate linting in CI/CD)
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Disable TypeScript type checking during build (use separate type checking in CI/CD)
  typescript: {
    ignoreBuildErrors: true,
  },
};

module.exports = withPWA(nextConfig);
