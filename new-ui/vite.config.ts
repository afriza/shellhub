import { defineConfig } from "vitest/config";
import vue from "@vitejs/plugin-vue";
// https://github.com/vuetifyjs/vuetify-loader/tree/next/packages/vite-plugin
// @ts-ignore
import vuetify from "vite-plugin-vuetify";
import inject from "@rollup/plugin-inject";
import NodeGlobalsPolyfillPlugin from "@esbuild-plugins/node-globals-polyfill";
import nodePolyfills from 'rollup-plugin-polyfill-node';

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      "@": "./src",
    },
  },
  plugins: [
    vue(),
    vuetify({ autoImport: true }),
    // @ts-ignore
    // nodePolyfills(),
    NodeGlobalsPolyfillPlugin({
      process: true,
      buffer: true
    }),
  ],

  define: {
    "process.env": process.env,
    global: {},
  },
  test: {
    environment: "jsdom",
    setupFiles: "vuetify.config.ts",
    deps: {
      inline: ["vuetify"],
    },
    globals: true,
  },
  build: {
    rollupOptions: {
      // @ts-ignore
      plugins: [inject({ Buffer: ["Buffer", "Buffer"], process: "process" }), nodePolyfills(),],
    },
  },
});
