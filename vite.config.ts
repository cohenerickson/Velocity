import solid from "solid-start/vite";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [solid({ ssr: false })],
  build: {
    assetsDir: ""
  },
  server: {
    proxy: {
      "/bare": {
        target: "http://localhost:8080",
        changeOrigin: true,
        ws: true,
        rewrite: (path) => path.replace(/^\/bare/, "")
      }
    }
  }
});
