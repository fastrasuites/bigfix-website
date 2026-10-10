/// <reference types="vitest" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
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
