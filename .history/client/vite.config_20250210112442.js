
// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import daisyui from 'daisyui'

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
        plugins: [daisyui],
        daisyui: {
          themes: [
            {
              light: {
                "primary": "rgb(29, 155, 240)",
                "primary-focus": "rgb(26, 140, 216)",
                "primary-content": "#ffffff",
                
                "secondary": "rgb(24, 24, 24)",
                "secondary-focus": "rgb(20, 20, 20)",
                "secondary-content": "#ffffff",
                
                "base-100": "#ffffff",
                "base-200": "#f9fafb",
                "base-300": "#d1d5db",
                "base-content": "#1f2937",
              },
              dark: {
                "primary": "rgb(29, 155, 240)",
                "primary-focus": "rgb(26, 140, 216)",
                "primary-content": "#ffffff",
                
                "secondary": "rgb(24, 24, 24)",
                "secondary-focus": "rgb(20, 20, 20)",
                "secondary-content": "#ffffff",
                
                "base-100": "#1f2937",
                "base-200": "#111827",
                "base-300": "#374151",
                "base-content": "#f9fafb",
              }
            }
          ],
        }
      }
    })
  ],
})