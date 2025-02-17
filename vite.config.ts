// vite.config.ts
import { defineConfig } from "vite"; 
import react from "@vitejs/plugin-react";
import viteImagemin from "vite-plugin-imagemin";
import tsconfigPaths from "vite-tsconfig-paths";
import { readFileSync } from "fs";
import path from "path";

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
    ],
    define: {
      __APP_VERSION__: JSON.stringify(packageJson.version),
    },
    server: {
      hmr: {
        protocol: "ws",
        port: 1234,
      },
      host: "localhost",
      port: 1234,
    },
    build: {
      minify: false,
      sourcemap: false,
    },
    optimizeDeps: {
      include: ["react-router", "react-router-dom", "tailwindcss-motion"],
    },
  };
});
