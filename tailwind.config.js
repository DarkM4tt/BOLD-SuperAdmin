/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "media",
  theme: {
    extend: {
      fontFamily: {
        redhat: ["Red Hat Display", "sans-serif"],
      },
      colors: {
        textGray: "#777777",
        midGray: "#999999",
        mid2Gray: "#EEEEEE",
        lightGray: "#AAAAAA",
        semiGray: "#BBBBBB",
        borderGray: "#DDDDDD",
        fontBlack: "#111111",
        boldCyan: "#18C4B8",
        themeBlue: "#1E293B",
        "white-10": "rgba(255, 255, 255, 0.1)",
        lightCyan: "rgba(24, 196, 184, 1)",
        backGround: "#F8F8F8",
      },
      fontSize: {
        mxl: "32px",
      },
      width: {},
      maxWidth: {
        maxW: "480px",
      },
    },
  },
  variants: {
    extend: {
      display: ["group-hover"],
    },
  },
  plugins: [],
};
