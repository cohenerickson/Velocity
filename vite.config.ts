import { uvPath } from "@titaniumnetwork-dev/ultraviolet";
import solid from "solid-start/vite";
import { defineConfig } from "vite";
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
        }
      ]
    }),
    solid({ ssr: false })
  ]
});
