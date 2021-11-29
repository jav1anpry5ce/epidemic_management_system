module.exports = {
  // mode: 'jit',
  purge: ["./src/**/*.{js,jsx,ts,tsx}", "./public/**/*.html"],
  darkMode: "media", // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        navBlue: {
          normal: "#12142b",
        },
      },
      screens: {
        xs: { max: "550px" },
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
