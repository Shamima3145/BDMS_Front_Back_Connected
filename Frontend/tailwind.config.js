/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    './pages/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
    './app/**/*.{js,jsx}',
    './src/**/*.{js,jsx}',
  ],
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
          DEFAULT: "#A83231",
          foreground: "#ffffff",
          50: "#FFFAEF",
          100: "#FFD7D7",
          200: "#FFB3B3",
          300: "#FF8F8F",
          400: "#D95959",
          500: "#A83231",
          600: "#942222",
          700: "#801B1B",
          800: "#6C1515",
          900: "#580F0F",
        },
        secondary: {
          DEFAULT: "#006747",
          foreground: "#ffffff",
          50: "#CBEAD7",
          100: "#99CEF9",
          200: "#66B2E6",
          300: "#3A8971",
          400: "#178656",
          500: "#006747",
          600: "#00503A",
          700: "#003A2C",
          800: "#00251E",
          900: "#001510",
        },
        accent: {
          DEFAULT: "#FFC269",
          foreground: "#1C0F4A",
          50: "#FFEFD9",
          100: "#FFE0B3",
          200: "#FFD18D",
          300: "#FFC269",
          400: "#E6A850",
          500: "#CC8F37",
          600: "#B3761E",
          700: "#995D05",
          800: "#804A00",
          900: "#663700",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
