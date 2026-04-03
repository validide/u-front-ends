import type { Plugin } from "vite";
import { defineConfig } from "vitest/config";

const demoHtmlModuleTransformPlugin: Plugin = {
  name: "demo-html-module-transform",
  apply: "serve" as const,
  transformIndexHtml(html: string, context: { path: string }) {
    const pathname = context.path.split("?")[0].split("#")[0];
    if (!/^\/docs\/public\/demo\/[^/]+\.html$/.test(pathname)) {
      return html;
    }

    return html
      .replace(
        /<script\s+src="\.\/lib\/bundle\/index\.js"><\/script>/g,
        '<script type="module" src="/docs/public/demo/js/dev-bundle-module.js"></script>',
      )
      .replace(
        /<script(?![^>]*\btype=)([^>]*?)\s+src="\.\/([^"]+)"([^>]*)><\/script>/g,
        '<script type="module"$1 src="./$2"$3></script>',
      )
      .replace(/<script(?![^>]*\b(?:src|type)\b)([^>]*)>([\s\S]*?)<\/script>/g, '<script type="module"$1>$2</script>');
  },
};

export default defineConfig({
  plugins: [demoHtmlModuleTransformPlugin],
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
    include: ["src/**/*.test.ts", "test/**/*.spec.ts"],
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
