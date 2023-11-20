import { build } from "esbuild";

const start = Date.now();
console.log("Building extension emulation scripts...");

await build({
  minify: true,
  bundle: true,
  entryPoints: ["src/api/extension.ts"],
  outdir: "dist/assets",
  format: "esm",
  splitting: true
});

console.log(`Extension emulation scripts took ${Date.now() - start}ms`);
