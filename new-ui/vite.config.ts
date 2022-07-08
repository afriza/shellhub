import { defineConfig } from "vitest/config";
import vue from "@vitejs/plugin-vue";

// https://github.com/vuetifyjs/vuetify-loader/tree/next/packages/vite-plugin
import vuetify from "vite-plugin-vuetify";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), vuetify({ autoImport: true })],
  test: {
    environment: "jsdom",
    setupFiles: "vuetify.config.ts",
    deps: {
      inline: ["vuetify"],
    },
    globals: true,
  },
});
