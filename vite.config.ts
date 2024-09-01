import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import pwa from './plugins/pwa'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), pwa],
})
