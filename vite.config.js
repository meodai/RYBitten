// vite.config.js
import { resolve } from "path";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

export default defineConfig({
  build: {
    lib: {
      // Multiple entry points
      entry: {
        main: resolve(__dirname, "src/main.ts"),
        cubes: resolve(__dirname, "src/cubes.ts"),
      },
      name: "RYBItten",
      formats: ["es", "cjs"],
    },
    rollupOptions: {
    },
  },
  plugins: [
    dts(),
  ],
});
