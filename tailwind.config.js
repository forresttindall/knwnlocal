/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    boxShadow: {
      xs: "0 1px 3px rgba(141, 113, 214, 0.10)",
      sm: "0 2px 8px rgba(141, 113, 214, 0.14)",
      md: "0 4px 16px rgba(141, 113, 214, 0.18)",
      lg: "0 8px 32px rgba(141, 113, 214, 0.22)",
      pop: "0 16px 48px rgba(141, 113, 214, 0.32)",
      none: "none",
    },
    extend: {
      colors: {
        ink: "#000000",
        violet: {
          DEFAULT: "#8d71d6",
          soft: "#dbd7e7",
          50: "#f3f1fb",
          100: "#e8e4f7",
          200: "#d1c9ef",
          300: "#b9ade7",
          400: "#a292de",
          500: "#8d71d6",
          600: "#7059be",
          700: "#5441a6",
          800: "#38298e",
          900: "#1c1276",
        },
        cream: "#f8f5ea",
        paper: "#ffffff",
      },
      fontFamily: {
        sans: ["var(--font-poppins)", "ui-sans-serif", "system-ui"],
      },
      letterSpacing: {
        headline: "-0.02em",
        eyebrow: "0.08em",
      },
      spacing: {
        s1: "4px",
        s2: "8px",
        s3: "12px",
        s4: "16px",
        s5: "20px",
        s6: "24px",
        s7: "32px",
        s8: "40px",
        s9: "56px",
        s10: "72px",
      },
      borderRadius: {
        xs: "4px",
        sm: "8px",
        block: "6px",
        md: "14px",
        lg: "20px",
        xl: "28px",
        "2xl": "40px",
        pill: "9999px",
      },
      backgroundImage: {
        "dark-radial":
          "radial-gradient(ellipse at 30% 40%, #1a1530 0%, #0d0b1a 100%)",
      },
    },
  },
  plugins: [],
};
