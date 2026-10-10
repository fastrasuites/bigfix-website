/// <reference types="vitest" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { copyFileSync, existsSync, mkdirSync } from "fs";
import { resolve } from "path";
import { fileURLToPath } from "url";

const __dirname = resolve(fileURLToPath(import.meta.url), "..");

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    {
      name: 'copy-tracker',
      closeBundle() {
        const src = resolve(__dirname, 'public/tracker.js');
        const destDir = resolve(__dirname, 'dist');
        const dest = resolve(destDir, 'tracker.js');
        if (existsSync(src)) {
          if (!existsSync(destDir)) {
            mkdirSync(destDir, { recursive: true });
          }
          copyFileSync(src, dest);
        }
      },
    },
  ],
  server: {
    proxy: {
      "/submit.php": {
        target: "https://bigfixtech.com",
        changeOrigin: true,
      },
      "/api/tracking": {
        target: "https://bigfixtech.com",
        changeOrigin: true,
      },
    },
  },
});
