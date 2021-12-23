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
        wiggle: {
          "0%, 100%": { transform: "translateY(-200px)" },
          "50%": { transform: "translateY(200px)" },
        },
      },
      animation: {
        wiggle: "wiggle 1s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
