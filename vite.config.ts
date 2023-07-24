import { uvPath } from "@titaniumnetwork-dev/ultraviolet";
import solid from "solid-start/vite";
import { defineConfig } from "vite";
import { nodePolyfills } from "vite-plugin-node-polyfills";
import { viteStaticCopy } from "vite-plugin-static-copy";

export default defineConfig({
  plugins: [
    viteStaticCopy({
      targets: [
        {
          src: `${uvPath}/.`.replace(/\\/g, "/"),
          dest: "uv"
        },
        {
          src: "public/uv/uv.config.js",
          dest: "uv"
        },
        {
          src: "./out/.",
          dest: "addon"
        }
      ]
    }),
    nodePolyfills({
      globals: {
        Buffer: true,
        global: true,
        process: true
      }
    }),
    solid({ ssr: false })
  ],
  server: {
    proxy: {
      "^/bare/*": {
        rewrite: (path: string) => path.replace(/^\/bare/, ""),
        target: "http://localhost:8080/",
        ws: true
      }
    }
  }
});
