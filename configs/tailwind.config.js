const config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./styles/**/*.{css}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: "#4f46e5",
          secondary: "#f97316",
          surface: "#0f172a",
          accent: "#14b8a6",
        },
      },
      boxShadow: {
        focus: "0 0 0 3px rgba(79, 70, 229, 0.38)",
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "monospace"],
      },
    },
  },
  plugins: [],
};

module.exports = config;
