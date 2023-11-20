import preact from "@preact/preset-vite";
import million from "million/compiler";
import { defineConfig } from "vite";

export default defineConfig({
  base: "./",
  plugins: [million.vite({ auto: true }), preact()],
  build: {
    target: "esnext"
  }
});
