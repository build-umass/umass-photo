import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  test: {
    projects: [
      {
        test: {
          name: "db-tests",
          include: ["test/db/**/*.test.ts"],
        },
      },
      {
        test: {
          name: "api-tests",
          include: ["test/api/**/*.test.ts"],
        },
      },
      {
        plugins: [react()],
        test: {
          name: "component-tests",
          include: ["test/components/**/*.test.tsx"],
          alias: { "@": path.resolve(__dirname, "./src/") },
          environment: "jsdom",
        },
      },
    ],
  },
});
