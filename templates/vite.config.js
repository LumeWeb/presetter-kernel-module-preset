import { defineConfig } from "vite";
import optimizer from "vite-plugin-optimizer";
import { nodePolyfills } from "vite-plugin-node-polyfills";
import wasm from "vite-plugin-wasm";
export default defineConfig({
  build: {viteBuild},
  resolve: {viteResolve},
  plugins: [
    wasm(),
    optimizer({viteOptimize}),
    nodePolyfills({vitePolyfill}),
  ],
});
