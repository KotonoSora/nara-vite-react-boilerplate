import { cloudflare } from "@cloudflare/vite-plugin";
import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig(() => ({
  build: {
    cssCodeSplit: true,
    minify: "esbuild" as const,
    target: "es2022",
    rollupOptions: {
      output: {
        // Better chunking strategy for optimal loading
        manualChunks: {
          // Vendor chunk for React and core libraries
          vendor: ["react", "react-dom"],
          // UI components chunk
          ui: ["radix-ui", "lucide-react", "@radix-ui/react-dialog", "@radix-ui/react-dropdown-menu"],
          // Utils chunk for smaller utilities
          utils: ["clsx", "tailwind-merge", "class-variance-authority"],
          // Date/time utilities
          date: ["date-fns"],
          // Form utilities  
          forms: ["react-hook-form", "@hookform/resolvers", "zod"],
          // Chart libraries
          charts: ["recharts"],
        },
        // Optimize chunk file names
        chunkFileNames: (chunkInfo) => {
          const facadeModuleId = chunkInfo.facadeModuleId ? chunkInfo.facadeModuleId.split('/').pop() : 'chunk';
          return `assets/[name]-[hash].js`;
        },
      },
      // Optimize external dependencies
      external: (id) => {
        // Don't bundle large libraries that can be loaded separately
        return false; // Keep everything bundled for now but optimize chunking
      }
    },
    // Optimize asset handling
    assetsInlineLimit: 4096, // Inline small assets
    // Enable source maps in development
    sourcemap: process.env.NODE_ENV === "development",
  },
  optimizeDeps: {
    // Pre-bundle these dependencies for faster dev server startup
    include: [
      "react", 
      "react-dom", 
      "react-router", 
      "clsx", 
      "tailwind-merge",
      "class-variance-authority",
      "lucide-react"
    ],
    // Exclude these from pre-bundling
    exclude: []
  },
  // Enable CSS optimization
  css: {
    devSourcemap: true,
  },
  plugins: [
    cloudflare({ viteEnvironment: { name: "ssr" } }),
    tailwindcss(),
    reactRouter(),
    tsconfigPaths(),
  ],
}));
