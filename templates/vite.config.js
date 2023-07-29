import { defineConfig } from "vite";
import optimizer from "vite-plugin-optimizer";
import { nodePolyfills } from "vite-plugin-node-polyfills";
export default defineConfig({
  define: {viteDefine},
  build: {viteBuild},
  resolve: {viteResolve},
  plugins: [
    optimizer({viteOptimize}),
    nodePolyfills({vitePolyfill}),
  ],
});
