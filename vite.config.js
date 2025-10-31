import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Séparer React Three Fiber dans son propre chunk
          'react-three': ['@react-three/fiber'],
          // Séparer Drei dans son propre chunk
          'drei': ['@react-three/drei'],
          // Séparer Three.js dans son propre chunk
          'three': ['three'],
          // Séparer React dans son propre chunk
          'react-vendor': ['react', 'react-dom'],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
  optimizeDeps: {
    include: ['@react-three/fiber', '@react-three/drei', 'three'],
  },
})
