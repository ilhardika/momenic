/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        primary: ['"DM Serif Text"', "serif"],
        secondary: ['"DM Sans"', "sans-serif"],
      },
      colors: {
        primary: {
          DEFAULT: "#3F4D34",
          light: "#E4E9CB",
          dark: "#2A3422",
          hover: "#4A5B3E",
        },
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-in": "fadeIn 1s ease-out forwards",
      },
      transformStyle: {
        "3d": "preserve-3d",
      },
      backfaceVisibility: {
        hidden: "hidden",
      },
      rotate: {
        "y-180": "rotateY(180deg)",
      },
      perspective: {
        card: "1000px",
      },
    },
  },
  plugins: [],
};
