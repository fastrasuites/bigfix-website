import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { resolve } from "path";
import { spawn, ChildProcessWithoutNullStreams } from "child_process";

function phpDevServer() {
  let php: ChildProcessWithoutNullStreams | null = null;
  return {
    name: "php-dev-server",
    configureServer() {
      php = spawn("php", ["-S", "localhost:8080", "-t", "public"], {
        stdio: ["ignore", "pipe", "pipe"],
      });
      php.stdout.on("data", (d: Buffer) => process.stdout.write(`[php] ${d}`));
      php.stderr.on("data", (d: Buffer) => process.stderr.write(`[php] ${d}`));
      console.log("[php] Starting PHP dev server on http://localhost:8080");
    },
    closeBundle() {
      if (php && !php.killed) php.kill();
    },
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), phpDevServer()],
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
  server: {
    proxy: {
      // Proxy all .php files to the PHP dev server (prevents Vite from serving raw PHP source)
      "/dashboard.php": {
        target: "http://localhost:8080",
        changeOrigin: true,
      },
      "/analytics.php": {
        target: "http://localhost:8080",
        changeOrigin: true,
      },
      "/reset-launch.php": {
        target: "http://localhost:8080",
        changeOrigin: true,
      },
      "/submit.php": {
        target: "http://localhost:8080",
        changeOrigin: true,
      },
      "/api/tracking": {
        target: "http://localhost:8080",
        changeOrigin: true,
      },
    },
  },
});
