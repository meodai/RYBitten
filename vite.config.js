import { resolve } from "path";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

export default defineConfig({
  build: {
    lib: {
      entry: {
        rybitten: resolve(__dirname, "src/main.ts"),
        cubes: resolve(__dirname, "src/cubes.ts"),
      },
      name: "rybitten",
    },
    rollupOptions: {
      external: [],
      output: [
        {
          format: "es",
          entryFileNames: "[name].mjs",
          preserveModules: true,
          exports: "named",
          inlineDynamicImports: false,
        },
        {
          format: "cjs",
          entryFileNames: "[name].cjs",
          preserveModules: true,
          exports: "named",
          inlineDynamicImports: false,
        },
      ],
    },
  },
  plugins: [dts({ exclude: ["src/__tests__/**", "src/demo.ts"] })],
  test: {
    include: ["src/__tests__/**/*.test.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html", "lcov"],
      include: ["src/main.ts", "src/cubes.ts"],
      exclude: ["src/__tests__/**", "src/p5-extension.ts", "src/demo.ts"],
    },
  },
});
