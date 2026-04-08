/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#080d18",
        card: "#0f1826",
        card2: "#17243a",
        cyan: "#00e5ff",
        amber: "#ffab00",
        danger: "#ff3d57",
        success: "#00e676",
        muted: "#607d8b",
        textmain: "#dde4f0",
        border: "rgba(0,229,255,0.13)",
      },
      fontFamily: {
        mono: ["'Share Tech Mono'", "monospace"],
        raj: ["Rajdhani", "sans-serif"],
        inter: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};
