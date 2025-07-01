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
    assetsInlineLimit: 0,
    manifest: true,
    ssrManifest: true,
    reportCompressedSize: false,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            const pkgPath = id.split("node_modules/")[1];
            const pkg = pkgPath.startsWith("@")
              ? pkgPath.split("/").slice(0, 2).join("/")
              : pkgPath.split("/")[0];

            return `vendor-${pkg.replace("/", "-")}`;
          }
        },
      },
    },
  },
  plugins: [
    cloudflare({ viteEnvironment: { name: "ssr" } }),
    tailwindcss(),
    reactRouter(),
    tsconfigPaths(),
  ],
}));
