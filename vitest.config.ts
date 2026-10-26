import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "jsdom",
    include: ["components/react/__tests__/**/*.test.{ts,tsx}"],
  },
});
