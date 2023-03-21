import terser from "@rollup/plugin-terser";
import typescript from "@rollup/plugin-typescript";

export default {
  input: {
    polyfil: "src/addon/polyfil.ts",
    backgroundWorker: "src/addon/worker.ts"
  },
  output: {
    entryFileNames: "[name].js",
    dir: "./out"
  },
  watch: process.env.BUILD === "development",
  plugins: [
    typescript(),
    process.env.BUILD !== "development" ? terser() : undefined
  ]
};
