// vite.config.ts
import { uvPath } from "file:///C:/Users/cohen/Documents/Coding/Velocity/node_modules/@titaniumnetwork-dev/ultraviolet/lib/index.cjs";
import solid from "file:///C:/Users/cohen/Documents/Coding/Velocity/node_modules/solid-start/vite/plugin.js";
import { defineConfig } from "file:///C:/Users/cohen/Documents/Coding/Velocity/node_modules/vite/dist/node/index.js";
import { viteStaticCopy } from "file:///C:/Users/cohen/Documents/Coding/Velocity/node_modules/vite-plugin-static-copy/dist/index.js";
var vite_config_default = defineConfig({
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
    solid({ ssr: false })
  ],
  server: {
    proxy: {
      "^/bare/*": {
        rewrite: (path) => path.replace(/^\/bare/, ""),
        target: "http://localhost:8080/",
        ws: true
      }
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxjb2hlblxcXFxEb2N1bWVudHNcXFxcQ29kaW5nXFxcXFZlbG9jaXR5XCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxjb2hlblxcXFxEb2N1bWVudHNcXFxcQ29kaW5nXFxcXFZlbG9jaXR5XFxcXHZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9DOi9Vc2Vycy9jb2hlbi9Eb2N1bWVudHMvQ29kaW5nL1ZlbG9jaXR5L3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgdXZQYXRoIH0gZnJvbSBcIkB0aXRhbml1bW5ldHdvcmstZGV2L3VsdHJhdmlvbGV0XCI7XHJcbmltcG9ydCBzb2xpZCBmcm9tIFwic29saWQtc3RhcnQvdml0ZVwiO1xyXG5pbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tIFwidml0ZVwiO1xyXG5pbXBvcnQgeyB2aXRlU3RhdGljQ29weSB9IGZyb20gXCJ2aXRlLXBsdWdpbi1zdGF0aWMtY29weVwiO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcclxuICBwbHVnaW5zOiBbXHJcbiAgICB2aXRlU3RhdGljQ29weSh7XHJcbiAgICAgIHRhcmdldHM6IFtcclxuICAgICAgICB7XHJcbiAgICAgICAgICBzcmM6IGAke3V2UGF0aH0vLmAucmVwbGFjZSgvXFxcXC9nLCBcIi9cIiksXHJcbiAgICAgICAgICBkZXN0OiBcInV2XCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgIHNyYzogXCJwdWJsaWMvdXYvdXYuY29uZmlnLmpzXCIsXHJcbiAgICAgICAgICBkZXN0OiBcInV2XCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgIHNyYzogXCIuL291dC8uXCIsXHJcbiAgICAgICAgICBkZXN0OiBcImFkZG9uXCJcclxuICAgICAgICB9XHJcbiAgICAgIF1cclxuICAgIH0pLFxyXG4gICAgc29saWQoeyBzc3I6IGZhbHNlIH0pXHJcbiAgXSxcclxuICBzZXJ2ZXI6IHtcclxuICAgIHByb3h5OiB7XHJcbiAgICAgIFwiXi9iYXJlLypcIjoge1xyXG4gICAgICAgIHJld3JpdGU6IChwYXRoOiBzdHJpbmcpID0+IHBhdGgucmVwbGFjZSgvXlxcL2JhcmUvLCBcIlwiKSxcclxuICAgICAgICB0YXJnZXQ6IFwiaHR0cDovL2xvY2FsaG9zdDo4MDgwL1wiLFxyXG4gICAgICAgIHdzOiB0cnVlXHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcbn0pO1xyXG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQXNULFNBQVMsY0FBYztBQUM3VSxPQUFPLFdBQVc7QUFDbEIsU0FBUyxvQkFBb0I7QUFDN0IsU0FBUyxzQkFBc0I7QUFFL0IsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDMUIsU0FBUztBQUFBLElBQ1AsZUFBZTtBQUFBLE1BQ2IsU0FBUztBQUFBLFFBQ1A7QUFBQSxVQUNFLEtBQUssR0FBRyxXQUFXLFFBQVEsT0FBTyxHQUFHO0FBQUEsVUFDckMsTUFBTTtBQUFBLFFBQ1I7QUFBQSxRQUNBO0FBQUEsVUFDRSxLQUFLO0FBQUEsVUFDTCxNQUFNO0FBQUEsUUFDUjtBQUFBLFFBQ0E7QUFBQSxVQUNFLEtBQUs7QUFBQSxVQUNMLE1BQU07QUFBQSxRQUNSO0FBQUEsTUFDRjtBQUFBLElBQ0YsQ0FBQztBQUFBLElBQ0QsTUFBTSxFQUFFLEtBQUssTUFBTSxDQUFDO0FBQUEsRUFDdEI7QUFBQSxFQUNBLFFBQVE7QUFBQSxJQUNOLE9BQU87QUFBQSxNQUNMLFlBQVk7QUFBQSxRQUNWLFNBQVMsQ0FBQyxTQUFpQixLQUFLLFFBQVEsV0FBVyxFQUFFO0FBQUEsUUFDckQsUUFBUTtBQUFBLFFBQ1IsSUFBSTtBQUFBLE1BQ047QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
