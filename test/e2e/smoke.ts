import { test, expect } from "@playwright/test";

test("has title", async ({ page }) => {
  expect(page.locator('nav h1:has-text("UMass Photo")')).toBeVisible();
});
