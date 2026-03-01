/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["'Sora'", "sans-serif"],
        body: ["'DM Sans'", "sans-serif"],
      },
      colors: {
        neo: {
          blue: "#4A90D9",
          teal: "#2EC4B6",
          mint: "#A8DADC",
          cream: "#F7FAFE",
          yellow: "#FFD166",
          safe: "#06D6A0",
          moderate: "#FFB347",
          high: "#EF476F",
          dark: "#1A2E44",
          muted: "#6B7E94",
        },
      },
      backgroundImage: {
        "neo-gradient":
          "linear-gradient(135deg, #EAF6FB 0%, #D0EEF6 30%, #C8E6F0 60%, #DFF0FA 100%)",
        "hero-gradient":
          "linear-gradient(135deg, #EBF4FF 0%, #D4EDF8 40%, #C2E0F4 70%, #E8F7FF 100%)",
        "card-glass":
          "linear-gradient(135deg, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0.4) 100%)",
      },
      boxShadow: {
        glass: "0 8px 32px rgba(74, 144, 217, 0.12)",
        "glass-lg": "0 16px 48px rgba(74, 144, 217, 0.18)",
        card: "0 4px 24px rgba(74, 144, 217, 0.10)",
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
        "4xl": "2rem",
      },
      animation: {
        "fade-in": "fadeIn 0.6s ease-out",
        "slide-up": "slideUp 0.7s ease-out",
        "pulse-ring": "pulseRing 2s ease-in-out infinite",
        spin: "spin 1s linear infinite",
        shimmer: "shimmer 2s linear infinite",
      },
      keyframes: {
        fadeIn: { "0%": { opacity: 0 }, "100%": { opacity: 1 } },
        slideUp: {
          "0%": { opacity: 0, transform: "translateY(24px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
        pulseRing: {
          "0%, 100%": { transform: "scale(1)", opacity: 0.6 },
          "50%": { transform: "scale(1.08)", opacity: 1 },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
    },
  },
  plugins: [],
};
