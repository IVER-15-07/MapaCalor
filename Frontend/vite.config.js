import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev
export default defineConfig({
  plugins: [
    react(), 
    tailwindcss()
  ],
  server: {
    host: '0.0.0.0', 
    port: 5173,
    // Autoriza explícitamente tu dominio corporativo para saltar el bloqueo de seguridad
    allowedHosts: true,
    watch: {
      usePolling: true 
    }
  }
})