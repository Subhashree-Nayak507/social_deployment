import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'


// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss()
  ],
  plugins: [daisyui],
        daisyui: {
          themes: ["light", "dark", "cupcake", {
            mytheme: {
              "primary": "#570DF8",
              "secondary": "#F000B8",
              "accent": "#37CDBE",
              "neutral": "#3D4451",
              "base-100": "#FFFFFF",
            }
          }]
        }
})
