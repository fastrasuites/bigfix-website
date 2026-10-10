/// <reference types="vitest" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { resolve } from "path";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
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
