import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import viteImagemin from "vite-plugin-imagemin";
import { readFileSync } from "fs";
import path from "path";

// Read package.json
const packageJson = JSON.parse(
  readFileSync(path.resolve(__dirname, "package.json"), "utf-8")
);

export default defineConfig({
  plugins: [
    react(),
    tsconfigPaths(),
    viteImagemin({
      gifsicle: { optimizationLevel: 3 },
      optipng: { optimizationLevel: 3 },
      mozjpeg: { quality: 85 },
    }),
  ],
  define: {
    __APP_VERSION__: JSON.stringify(packageJson.version),
  },
  build: {
    minify: "esbuild", // Esbuild is faster & lighter than Terser
    sourcemap: false,
    chunkSizeWarningLimit: 1024,
    rollupOptions: {
      output: {
        manualChunks: undefined, // Avoid excessive chunk splitting
      },
    },
  },
  optimizeDeps: {
    include: ["react-router-dom"],
  },
});
