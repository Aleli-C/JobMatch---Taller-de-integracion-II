import type { Config } from "tailwindcss"

const config: Config = {
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: "#0069c0", // tu color principal
        background: {
          light: "#ffffff",
          dark: "#121212"
        },
        text: {
          light: "#000000",
          dark: "#ffffff"
        }
      }
    }
  },
  plugins: []
}

export default config
