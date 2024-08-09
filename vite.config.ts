import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { resolve } from "node:path";
import pwa from "./plugins/pwa";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), pwa],
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
});
