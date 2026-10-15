import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    port: 5173,
    strictPort: true,
    proxy: {
      '/api': {
        target: process.env.VITE_PROXY_TARGET || 'http://localhost:5094',
        changeOrigin: true,
        secure: false,
      },
      '/hubs': {
        target: process.env.VITE_PROXY_TARGET || 'http://localhost:5094',
        ws: true,
        changeOrigin: true,
      },
    },
  },
  build: {
    chunkSizeWarningLimit: 900,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('maplibre-gl')) return 'vendor-map';
            if (id.includes('chart.js') || id.includes('react-chartjs-2')) return 'vendor-charts';
            if (id.includes('@radix-ui') || id.includes('framer-motion') || id.includes('lucide-react')) return 'vendor-ui';
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router-dom')) return 'vendor-core';
            return 'vendor-libs';
          }
        },
      },
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
  },
})
