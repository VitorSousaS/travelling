/** @type {import('tailwindcss').Config} */
export default {
  important: true,
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          dark: "#043419",
          darkOpacity: "rgba(4, 52, 25, 0.60)",
          light: "#6B7D5C",
          extraLight: "#50A41C",
        },
        secondary: {
          dark: "#C5A110",
          light: "#FFDE59",
        },
        auxiliary: {
          beige: "#F6EFDC",
          error: "#ff3219",
          info: "#15749C",
        },
      },
      transitionProperty: {
        scale: "transform, opacity",
      },
    },
    screens: {
      xs: { min: "0px", max: "360px" },
      // => @media (min-width: 0px and max-width: 360px) { ... }

      sm: { min: "361px", max: "767px" },
      // => @media (min-width: 361px and max-width: 767px) { ... }

      md: { min: "768px", max: "1023px" },
      // => @media (min-width: 768px and max-width: 1023px) { ... }

      lg: { min: "1024px", max: "1279px" },
      // => @media (min-width: 1024px and max-width: 1279px) { ... }

      xl: { min: "1280px", max: "1535px" },
      // => @media (min-width: 1280px and max-width: 1535px) { ... }
    },
  },
  plugins: [],
};
