import { defineConfig } from "vitest/config";

export default defineConfig({
  build: {
    emptyOutDir: false,
    lib: {
      entry: "./dist/js/index.js",
      name: "validide_uFrontEnds",
      fileName: "index",
      formats: ["es", "cjs", "umd", "iife"],
    },
    outDir: "./dist/bundle",
    minify: true,
  },
  test: {
    environment: "jsdom",
    coverage: {
      exclude: ["**/ci-cd/**", "**/{app,public,test,docs,dist}/**", "**/**.test.ts", "**/**.spec.ts", "vite.config.ts"],
      thresholds: {
        autoUpdate: true,
        branches: 100,
        functions: 100,
        lines: 100,
        statements: 100,
      },
      reporter: ["text", "lcovonly"],
    },
  },
});
