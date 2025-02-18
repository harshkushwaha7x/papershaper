/* eslint-disable @typescript-eslint/no-explicit-any */
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import viteImagemin from "vite-plugin-imagemin";
import tsconfigPaths from "vite-tsconfig-paths";
import { readFileSync } from "fs";
import path from "path";
import { visualizer } from "rollup-plugin-visualizer";
import viteCompression from "vite-plugin-compression";

// Read package.json
const packageJson = JSON.parse(
  readFileSync(path.resolve(__dirname, "package.json"), "utf-8")
);

export default defineConfig(() => {
  return {
    plugins: [
      react(),
      tsconfigPaths(),
      viteImagemin({
        gifsicle: { optimizationLevel: 3 },
        optipng: { optimizationLevel: 3 },
        mozjpeg: { quality: 85 },
      }),
      visualizer({ open: true }),
      viteCompression(),
    ],
    define: {
      __APP_VERSION__: JSON.stringify(packageJson.version),
    },
    server: {
      hmr: {
        port: 1234,
      },
      host: "localhost",
      port: 1234,
    },
    build: {
      sourcemap: false,
      chunkSizeWarningLimit: 1024,
      minify: "terser",
      terserOptions: {
        compress: {
          drop_console: true, // Remove console logs in production
        },
      },
      rollupOptions: {
        // Properly handle eval warnings
        onwarn(warning, warn) {
          if (warning.code === "EVAL") return;
          warn(warning);
        },
        output: {
          // Optimize chunking by grouping common dependencies
          manualChunks: {
            vendor: ["react", "react-dom", "react-router-dom"],
            utils: ["lodash"],
          },
        },
      },
    },
    optimizeDeps: {
      force:true,
      include: ["react-router-dom"],
    },
  };
});
