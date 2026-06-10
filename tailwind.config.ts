import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/context/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        blush: {
          50: "#fff7f8",
          100: "#ffe9ee",
          200: "#ffd1dc",
          300: "#f7aebf",
          400: "#eb7f9c",
          500: "#d9577b",
          600: "#be3f67",
          700: "#9d3154"
        },
        pearl: "#fffaf4",
        champagne: "#d9a85f",
        sage: "#748c77",
        ink: "#2d2630"
      },
      boxShadow: {
        soft: "0 18px 60px rgba(45, 38, 48, 0.08)",
        button: "0 12px 24px rgba(217, 87, 123, 0.22)"
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "Inter", "ui-sans-serif", "system-ui"]
      }
    }
  },
  plugins: []
};

export default config;
