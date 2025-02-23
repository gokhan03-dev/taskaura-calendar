
import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      colors: {
        background: {
          DEFAULT: "#FFFFFF",
          dark: "#0A0A0B",
        },
        primary: {
          DEFAULT: "#0A0A0B",
          dark: "#FFFFFF",
        },
        accent: {
          DEFAULT: "#007AFF",
          hover: "#0051FF",
        },
        success: {
          DEFAULT: "#34C759",
          light: "#E8FAE9",
        },
        warning: {
          DEFAULT: "#FF9500",
          light: "#FFF4E5",
        },
        danger: {
          DEFAULT: "#FF3B30",
          light: "#FFE5E5",
        },
        neutral: {
          50: "#F9FAFB",
          100: "#F3F4F6",
          200: "#E5E7EB",
          300: "#D1D5DB",
          400: "#9CA3AF",
          500: "#6B7280",
          600: "#4B5563",
          700: "#374151",
          800: "#1F2937",
          900: "#111827",
        },
      },
      borderRadius: {
        DEFAULT: "0.75rem",
        lg: "1rem",
        xl: "1.25rem",
      },
      boxShadow: {
        glass: "0 4px 15px 0 rgba(0, 0, 0, 0.05)",
        modal: "0 8px 30px rgba(0, 0, 0, 0.12)",
      },
      keyframes: {
        slideIn: {
          '0%': { transform: 'translateX(-100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      animation: {
        slideIn: 'slideIn 0.3s ease-out',
        fadeIn: 'fadeIn 0.3s ease-out',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
