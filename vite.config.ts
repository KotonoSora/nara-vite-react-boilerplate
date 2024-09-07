import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { resolve } from 'node:path'

import pwa from './plugins/pwa'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), pwa],
  resolve: {
    alias: {
      '#root': resolve(__dirname, 'src'),
      '#assets': resolve(__dirname, 'src/assets'),
      '#core': resolve(__dirname, 'src/core'),
      '#features': resolve(__dirname, 'src/features'),
      '#plugins': resolve(__dirname, 'plugins'),
    },
  },
})
