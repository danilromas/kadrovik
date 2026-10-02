import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { aiProxyPlugin } from './vite-plugin-ai-proxy'

export default defineConfig({
  base: './',
  plugins: [react(), aiProxyPlugin()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    host: true,
  },
})
