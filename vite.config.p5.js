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
        // We want to extend the global rybitten object if it exists, or create it.
        // But UMD usually assigns to a variable.
        // If we name it "rybitten", it might overwrite the main library if loaded after.
        // But since this file exports * from main, it is a superset.
        // So overwriting is actually fine/desired if the user loads this INSTEAD of the main lib.
        // If they load BOTH, it's redundant but safe if they are identical versions.
        name: "rybitten", 
      },
    },
  },
});
