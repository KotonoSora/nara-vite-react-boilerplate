import path from 'path'

import react from '@vitejs/plugin-react-swc'
import { defineConfig } from 'vite'

import pwa from './plugins/pwa'

// https://vite.dev/config/
export default defineConfig({
  base: '/',
  plugins: [react(), pwa],
  resolve: {
    alias: {
      '#root': path.resolve(__dirname, './src'),
      '#assets': path.resolve(__dirname, './src/assets'),
      '#core': path.resolve(__dirname, './src/core'),
      '#features': path.resolve(__dirname, './src/features'),
      '#plugins': path.resolve(__dirname, './plugins'),
      '#tests': path.resolve(__dirname, './tests'),
    },
  },
})
