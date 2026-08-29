import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: [
      "packages/core/src/**/*.test.ts",
      "packages/create-openblog/src/**/*.test.ts",
      "packages/content/**/*.test.ts",
    ],
  },
});
