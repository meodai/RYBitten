// vite.config.js
import { resolve } from "path";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

export default defineConfig({
  // define the input file being src/index.html
  root: "src",
  build: {
    outDir: "../dist",
  },
});
