import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss({
      config: {
        content: [
          "./index.html",
          "./src/**/*.{js,ts,jsx,tsx}",
        ],
        theme: {
          extend: {},
        },
        plugins: [require("daisyui")],
        daisyui: {
          themes: ["light", "dark", "night", "dim", "sunset"], // Add the themes you want to use
        }
      }
    })
  ],
})