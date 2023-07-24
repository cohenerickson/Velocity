import NodePolyfillPlugin from "node-polyfill-webpack-plugin";
import path from "path";
import { BundleAnalyzerPlugin } from "webpack-bundle-analyzer";

const __dirname = process.cwd();

export default (env, argv) => {
  return {
    entry: {
      worker: "./src/addon/worker.ts"
    },
    output: {
      path: path.resolve(__dirname, "./out"),
      filename: "[name].js"
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: "ts-loader",
          exclude: /node_modules/
        }
      ]
    },
    resolve: {
      extensions: [".tsx", ".ts", ".js", ".d.ts"],
      alias: {
        "~": path.resolve(__dirname, "./src")
      }
    },
    plugins: [
      new NodePolyfillPlugin(),
      argv.mode === "development" ? new BundleAnalyzerPlugin() : undefined
    ]
  };
};
