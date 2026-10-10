/// <reference types="vitest" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { copyFileSync, existsSync } from "fs";
import { resolve } from "path";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    {
      name: 'copy-tracker',
      writeBundle() {
        const src = resolve(__dirname, 'public/tracker.js');
        const dest = resolve(__dirname, 'dist/tracker.js');
        if (existsSync(src)) {
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
