import { test, expect } from "@playwright/test";

test("API Tests", async ({ request }) => {
  const response = await request.get("/api/health");
  expect(response.ok());
});
