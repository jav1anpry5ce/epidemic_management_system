module.exports = {
  content: ["./src/**/*.{js,jsx}"],
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
      keyframes: {
        slideIn: {
          "0%": { transform: "translateX(70%)" },
          "50%": { transform: "translateX(-10%)" },
          "100%": { transform: "translateX(0%)" },
        },
        slideLeft: {
          "0%": { transform: "translateX(-150%)" },
          "50%": { transform: "translateX(30%)" },
          "100%": { transform: "translateX(0%)" },
        },
      },
      animation: {
        slideIn: "slideIn 1.5s ease-in-out",
        slideLeft: "slideLeft 1.5s ease-in-out",
      },
    },
  },
  plugins: [],
};
