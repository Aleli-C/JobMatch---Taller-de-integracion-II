import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "node", // para auth (no jsdom)
    setupFiles: "./tests/setup.ts", // archivo de setup global
  },
});
