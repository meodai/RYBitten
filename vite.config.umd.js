import { resolve } from "path";
import { defineConfig } from "vite";

export default defineConfig({
    build: {
        emptyOutDir: false,
        lib: {
            entry: resolve(__dirname, "src/entryForUMD.ts"),
            name: "rybitten",
            formats: ["umd"],
            fileName: (format) => `rybitten.${format}.js`,
        },
        rollupOptions: {
            output: {
                entryFileNames: "rybitten.umd.js",
                exports: "named",
            },
        },
    },
});
