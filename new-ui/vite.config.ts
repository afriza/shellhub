import { defineConfig } from "vitest/config";
import vue from "@vitejs/plugin-vue";
// https://github.com/vuetifyjs/vuetify-loader/tree/next/packages/vite-plugin
// @ts-ignore
import vuetify from "vite-plugin-vuetify";
import inject from "@rollup/plugin-inject";
import NodeGlobalsPolyfillPlugin from "@esbuild-plugins/node-globals-polyfill";
import polyfillNode from "rollup-plugin-polyfill-node";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 3000,
  },
  plugins: [
    vue({
      template: {
        compilerOptions: {
          isCustomElement: (tag) => tag.includes("v-list-item-group"),
        },
      },
    }),
    vuetify({ autoImport: true }),
    // @ts-ignore
    // nodePolyfills(),
    NodeGlobalsPolyfillPlugin({
      process: true,
      buffer: true,
    }),
  ],
  optimizeDeps: {
    esbuildOptions: {
      // Node.js global to browser globalThis
      define: {
        global: "globalThis",
      },
      // Enable esbuild polyfill plugins
      plugins: [
        NodeGlobalsPolyfillPlugin({
          buffer: true,
        }),
      ],
    },
  },
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
      plugins: [
        // @ts-ignore
        inject({ Buffer: ["Buffer", "Buffer"], process: "process" }),
        // @ts-ignore
        polyfillNode(),
      ],
    },
  },
});
