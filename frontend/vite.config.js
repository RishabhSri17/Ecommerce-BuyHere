import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss(),
    react()
  ],
  server: {
    proxy: {
      '/api': {
        target: process.env.VITE_BACKEND_URL,  // 🔄 replace with your actual backend URL
        changeOrigin: true,
        secure: true,
      },
    },
  },
})
