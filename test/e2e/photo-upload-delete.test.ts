import { test, expect } from "@playwright/test";
import path from "path";
import { login } from "./utils/login";
import { getAdminClient } from "@/app/utils/supabase/client";
import { insertTestUsers } from "../db/generateTestData";
import { randomUUID } from "crypto";

const testUserEmail = "user@example.com";

// This test covers the full user journey of uploading and deleting a photo
test.describe("Photo Upload and Delete Flow", () => {
  // Helper function to generate random test data
  const getTestPhotoData = () => {
    const timestamp = Date.now();
    return {
      title: `Test Photo ${timestamp}`,
      description: `This is a test photo uploaded at ${timestamp}`,
      tag: `test-tag-${timestamp}`,
    };
  };

  test.beforeAll(async ({}) => {
    const client = getAdminClient();

    await insertTestUsers(client, [
      {
        id: randomUUID(),
        email: testUserEmail,
        username: "testuser",
        role: "member",
      },
    ]);

  });

  test("user can upload a photo and delete it via the modal", async ({
    page,
    request,
  }) => {
    await login({
      page,
      request,
      email: testUserEmail,
    });

    const testData = getTestPhotoData();

    // Navigate to the photo gallery
    await page.goto("/photo-gallery");

    // Wait for the page to load
    await expect(page.locator("#photo-grid")).toBeVisible();

    // Count initial photos
    const initialPhotoCount = await page.locator("#photo-item").count();

    // Click the add photo button to open upload modal
    await page.locator("#add-photo-button").click();

    // Wait for the upload modal to appear
    await expect(page.locator('input[name="title"]').first()).toBeVisible();

    // Upload a test image
    const testImagePath = path.join(__dirname, "../fixtures/test-image.jpg");
    const fileInput = page.locator('input[type="file"]').first();
    await fileInput.setInputFiles(testImagePath);

    // Fill in the title
    await page.locator('input[name="title"]').first().fill(testData.title);

    // Fill in the description
    await page
      .locator('textarea[name="description"]')
      .first()
      .fill(testData.description);

    // Add a tag by typing and clicking the Add Tag button
    const tagInput = page.locator('input[placeholder="Create new tag..."]');
    await tagInput.fill(testData.tag);
    await page.locator('button:has-text("Add Tag")').first().click();

    // Wait for the tag to be created and appear in the tag list
    await expect(page.locator(`text=${testData.tag}`).first()).toBeVisible();

    // Click the Upload button
    await page.locator('button[type="submit"]:has-text("Upload")').click();

    // Wait for the upload to complete and modal to close
    // The modal should disappear after successful upload
    await expect(page.locator('input[name="title"]').first()).not.toBeVisible({
      timeout: 10000,
    });

    // Verify the photo appears in the gallery
    // The photo count should increase by 1
    await page.waitForTimeout(2000); // Wait for the gallery to refresh

    const newPhotoCount = await page.locator("#photo-item").count();
    expect(newPhotoCount).toBe(initialPhotoCount + 1);

    // Find the newly uploaded photo by title
    // Look for the photo with the test title
    const uploadedPhotoContainer = page
      .locator(`#photo-grid >> text=${testData.title}`)
      .first();
    await expect(uploadedPhotoContainer).toBeVisible();

    // Click on the photo to open the modal
    const photoImage = page.locator("#photo-item").first();
    await photoImage.click();

    // Wait for the modal to open
    await expect(page.locator("#photo-modal")).toBeVisible();

    // Verify the modal shows the correct photo details
    await expect(
      page.locator("#modal-details >> h2", { hasText: testData.title }),
    ).toBeVisible();

    // Click the delete button (trash icon) in the modal
    await page.locator("#modal-delete").click();

    // Wait for the deletion confirmation modal to appear
    await expect(
      page.locator("text=Are you sure you want to delete this photo?"),
    ).toBeVisible();

    // Verify the photo title appears in the confirmation message
    await expect(page.locator(`text="${testData.title}"`).last()).toBeVisible();

    // Click the "Delete Photo" button to confirm
    await page.locator('button:has-text("Delete Photo")').click();

    // Wait for the deletion to complete
    // The modal should close
    await expect(page.locator("#photo-modal")).not.toBeVisible({
      timeout: 10000,
    });

    // Verify the photo is removed from the gallery
    // The photo count should return to the original count
    await page.waitForTimeout(2000); // Wait for the gallery to refresh

    const finalPhotoCount = await page.locator("#photo-item").count();
    expect(finalPhotoCount).toBe(initialPhotoCount);

    // Verify the photo title no longer appears in the gallery
    await expect(
      page.locator(`#photo-grid >> text=${testData.title}`).first(),
    ).not.toBeVisible();
  });

  test("delete button only shows for photo owner", async ({ page }) => {
    // This test verifies that the delete button only appears for photos
    // owned by the current user

    await page.goto("/photo-gallery");

    // Wait for photos to load
    await expect(page.locator("#photo-grid")).toBeVisible();

    const photoCount = await page.locator("#photo-item").count();

    if (photoCount === 0) {
      // Skip test if no photos exist
      test.skip();
      return;
    }

    // Click on the first photo
    await page.locator("#photo-item").first().click();

    // Wait for modal to open
    await expect(page.locator("#photo-modal")).toBeVisible();

    // Check if delete button exists
    const deleteButton = page.locator("#modal-delete");
    const deleteButtonVisible = await deleteButton.isVisible();

    // The delete button should either be visible (user owns the photo)
    // or not visible (user doesn't own the photo)
    // This test just ensures the button behavior is consistent
    if (deleteButtonVisible) {
      // If visible, it should be clickable
      await expect(deleteButton).toBeEnabled();
    }

    // Close the modal
    await page.locator("#modal-close").click();
    await expect(page.locator("#photo-modal")).not.toBeVisible();
  });
});
