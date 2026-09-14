import { resolve } from "path";
import { defineConfig } from "vite";

export default defineConfig({
  build: {
    emptyOutDir: false,
    lib: {
      entry: resolve(__dirname, "src/p5-extension.ts"),
      name: "rybitten",
      formats: ["umd"],
      fileName: () => `p5.rybitten.umd.js`,
    },
    rollupOptions: {
      output: {
        entryFileNames: "p5.rybitten.umd.js",
        exports: "named",
        // Same global name as the main UMD. This bundle re-exports everything
        // from main, so loading it instead of (or after) rybitten.umd.js is safe.
        name: "rybitten",
      },
    },
  },
});
