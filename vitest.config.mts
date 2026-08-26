/**
 * Test runner config.
 *
 * `jsdom` rather than `node` because the export helpers touch Blob, anchor
 * elements, and navigator.clipboard — they are browser-side by nature, and
 * testing them against a DOM is the honest way to cover them.
 *
 * `resolve.tsconfigPaths` is what teaches Vitest the `@/*` alias from
 * tsconfig.json; without it every `@/data/format` import fails to resolve
 * under test. Vite resolves this natively, so no plugin is needed.
 *
 * The `.mts` extension keeps this file loading as ESM.
 */
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: { tsconfigPaths: true },
  test: {
    environment: "jsdom",
    include: ["src/**/*.test.ts"],
    coverage: {
      provider: "v8",
      include: ["src/lib/**/*.ts", "src/data/format.ts"],
      exclude: ["src/**/*.test.ts"],
      reporter: ["text"],
    },
  },
});
