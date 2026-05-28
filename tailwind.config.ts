import type { Config } from "tailwindcss";

const config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        cream: {
          50: "#FFF8E7",
          100: "#FFFBF0",
          200: "#FFF1D6",
        },
        ink: {
          400: "#B6A28A",
          600: "#7A6450",
          900: "#3D2E1F",
        },
        leaf: {
          100: "#E3F2DA",
          500: "#5BA84A",
          600: "#4A8E3B",
        },
        sun: {
          100: "#FFF2CC",
          400: "#FFCB47",
        },
        rose: {
          100: "#FBE3E0",
          300: "#F3B2AD",
          400: "#EB8B85",
          500: "#E36B6B",
        },
        sky: {
          100: "#E4F4FA",
          500: "#6BB8DB",
        },
        border: {
          200: "#F0E2C8",
        },
        danger: {
          500: "#E0635A",
        },
      },
      fontFamily: {
        rounded: ["var(--font-rounded)", "system-ui", "sans-serif"],
        noto: ["var(--font-noto)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 2px 6px rgba(110,80,40,0.08)",
        cta: "0 6px 16px rgba(110,80,40,0.12)",
        float: "0 12px 28px rgba(110,80,40,0.18)",
        bar: "0 -4px 12px rgba(110,80,40,0.10)",
        pop: "0 4px 0 rgba(110,80,40,0.08), 0 2px 6px rgba(110,80,40,0.10)",
      },
      borderRadius: {
        "4xl": "2rem",
      },
      backgroundImage: {
        "ring-leaf":
          "conic-gradient(from -90deg, #5BA84A var(--ring-progress, 0%), #F0E2C8 0)",
        "ring-rose":
          "conic-gradient(from -90deg, #E36B6B var(--ring-progress, 0%), #FBE3E0 0)",
      },
      keyframes: {
        "secret-card-stamp": {
          "0%": { transform: "scale(1)" },
          "30%": { transform: "scale(1.04)" },
          "55%": { transform: "scale(1.08) rotate(-0.4deg)" },
          "100%": { transform: "scale(1.015) rotate(0deg)" },
        },
        "secret-card-fade": {
          "0%": { opacity: "1", transform: "scale(1) translateY(0)" },
          "100%": { opacity: "0.32", transform: "scale(0.94) translateY(6px)" },
        },
        "secret-card-shimmer": {
          "0%": { opacity: "0", transform: "translate(-30%, -30%) scale(0.6)" },
          "30%": { opacity: "1" },
          "100%": { opacity: "0", transform: "translate(30%, 30%) scale(1.4)" },
        },
        "secret-card-confirm": {
          "0%": { opacity: "0", transform: "translateY(8px) scale(0.92)" },
          "35%": { opacity: "1", transform: "translateY(-2px) scale(1.04)" },
          "100%": { opacity: "1", transform: "translateY(0) scale(1)" },
        },
        "secret-seal-pulse": {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(227,107,107,0)" },
          "40%": { boxShadow: "0 0 0 12px rgba(227,107,107,0.18)" },
        },
        "word-card-pop": {
          "0%": { transform: "scale(1)" },
          "35%": { transform: "scale(1.06) rotate(-0.6deg)" },
          "65%": { transform: "scale(1.02) rotate(0.3deg)" },
          "100%": { transform: "scale(1.015) rotate(0deg)" },
        },
        "word-card-pop-alt": {
          "0%": { transform: "scale(1)" },
          "35%": { transform: "scale(1.06) rotate(0.6deg)" },
          "65%": { transform: "scale(1.02) rotate(-0.3deg)" },
          "100%": { transform: "scale(1.015) rotate(0deg)" },
        },
        "word-card-unpop": {
          "0%": { transform: "scale(1.015)" },
          "40%": { transform: "scale(0.97)" },
          "100%": { transform: "scale(1)" },
        },
        "word-card-unpop-alt": {
          "0%": { transform: "scale(1.015) rotate(0.2deg)" },
          "40%": { transform: "scale(0.97) rotate(-0.2deg)" },
          "100%": { transform: "scale(1) rotate(0deg)" },
        },
        "word-card-glow": {
          "0%": { opacity: "0", transform: "translate(-40%, -10%) scale(0.6)" },
          "30%": { opacity: "0.9" },
          "100%": { opacity: "0", transform: "translate(40%, 10%) scale(1.4)" },
        },
        "word-sparkle-rise": {
          "0%": { opacity: "0", transform: "translateY(8px) scale(0.6)" },
          "30%": { opacity: "1", transform: "translateY(-8px) scale(1.05)" },
          "100%": { opacity: "0", transform: "translateY(-28px) scale(0.85)" },
        },
        "word-ribbon-drop": {
          "0%": { opacity: "0", transform: "translate(6px, -10px) rotate(8deg) scale(0.8)" },
          "55%": { opacity: "1", transform: "translate(0, 2px) rotate(8deg) scale(1.05)" },
          "100%": { opacity: "1", transform: "translate(0, 0) rotate(8deg) scale(1)" },
        },
        "word-finale-pop": {
          "0%": { opacity: "0", transform: "translateY(10px) scale(0.9)" },
          "55%": { opacity: "1", transform: "translateY(-3px) scale(1.04)" },
          "100%": { opacity: "1", transform: "translateY(0) scale(1)" },
        },
      },
      animation: {
        "secret-card-stamp": "secret-card-stamp 520ms cubic-bezier(0.22, 1, 0.36, 1) both",
        "secret-card-fade": "secret-card-fade 320ms ease-out both",
        "secret-card-shimmer": "secret-card-shimmer 700ms ease-out both",
        "secret-card-confirm": "secret-card-confirm 360ms cubic-bezier(0.22, 1, 0.36, 1) 80ms both",
        "secret-seal-pulse": "secret-seal-pulse 520ms ease-out both",
        "word-card-pop": "word-card-pop 480ms cubic-bezier(0.22, 1, 0.36, 1) both",
        "word-card-pop-alt": "word-card-pop-alt 480ms cubic-bezier(0.22, 1, 0.36, 1) both",
        "word-card-unpop": "word-card-unpop 260ms ease-out both",
        "word-card-unpop-alt": "word-card-unpop-alt 260ms ease-out both",
        "word-card-glow": "word-card-glow 720ms ease-out both",
        "word-sparkle-rise": "word-sparkle-rise 900ms cubic-bezier(0.22, 1, 0.36, 1) both",
        "word-ribbon-drop": "word-ribbon-drop 420ms cubic-bezier(0.22, 1, 0.36, 1) 60ms both",
        "word-finale-pop": "word-finale-pop 420ms cubic-bezier(0.22, 1, 0.36, 1) both",
      },
    },
  },
} satisfies Config;

export default config;
