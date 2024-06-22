// vite.config.js
import { defineConfig } from "vite";
import { viteSingleFile } from "vite-plugin-singlefile";

export default defineConfig({
  // define the input file being src/index.html
  root: "src",
  build: {
    outDir: "../dist",
  },
  plugins: [viteSingleFile()],
});
