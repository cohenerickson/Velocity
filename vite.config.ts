import solid from "solid-start/vite";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [solid()],
  server: {
    proxy: {
      "/bare": {
        target: "http://127.0.0.1:8080",
        changeOrigin: true,
        ws: true,
        rewrite: (path) => path.replace(/^\/bare/, "")
      }
    }
  }
});
