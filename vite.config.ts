import { resolve } from 'node:path'

import react from '@vitejs/plugin-react-swc'
import { defineConfig } from 'vite'

import pwa from './plugins/pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), pwa],
  resolve: {
    alias: {
      '#root': resolve(__dirname, 'src'),
      '#assets': resolve(__dirname, 'src/assets'),
      '#core': resolve(__dirname, 'src/core'),
      '#features': resolve(__dirname, 'src/features'),
      '#shadcn-ui': resolve(__dirname, 'src/core/infrastructure/shadcn-ui'),
      '#plugins': resolve(__dirname, 'plugins'),
      '#tests': resolve(__dirname, 'tests'),
    },
  },
})
