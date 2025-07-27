import type { Config } from "tailwindcss"

const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Custom colors for the main site (amber theme)
        amber: {
          50: "#fffbeb",
          100: "#fff3c7",
          200: "#ffe79b",
          300: "#ffd86e",
          400: "#ffc542",
          500: "#ffb020",
          600: "#f09300",
          700: "#c27400",
          800: "#945700",
          900: "#663b00",
          950: "#3d1f00",
        },
        // Custom colors for the admin panel (neutral/blueish theme)
        "admin-background": "hsl(210 40% 96.1%)",
        "admin-foreground": "hsl(222.2 47.4% 11.2%)",
        "admin-primary": "hsl(222.2 47.4% 11.2%)",
        "admin-primary-foreground": "hsl(210 40% 98%)",
        "admin-secondary": "hsl(210 40% 96.1%)",
        "admin-secondary-foreground": "hsl(222.2 47.4% 11.2%)",
        "admin-accent": "hsl(210 40% 96.1%)",
        "admin-accent-foreground": "hsl(222.2 47.4% 11.2%)",
        "admin-border": "hsl(214.3 31.8% 91.4%)",
        "admin-ring": "hsl(222.2 47.4% 11.2%)",
        "admin-card": "hsl(0 0% 100%)",
        "admin-card-foreground": "hsl(222.2 47.4% 11.2%)",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config

export default config
