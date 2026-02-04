import { test, expect, Page } from "@playwright/test";
import path from "path";
import { login } from "./utils/login";
import { getAdminClient } from "../utils/adminClient";
import { insertTestUsers } from "../db/generateTestData";
import { randomInt, randomUUID } from "crypto";

// This test covers the full user journey of uploading and deleting a photo
test.describe("Photo Upload and Delete Flow", () => {
  const testUserEmail = `${randomUUID()}-user@example.com`;
  // Helper function to generate random test data
  const getTestPhotoData = () => {
    const uuid = randomInt(100000, 999999);
    return {
      title: `Test Photo ${uuid}`,
      description: `This is a test photo uploaded at ${uuid}`,
      tag: `test-tag-${uuid}`,
    };
  };

  /**
   * Verifies whether a photo with the given title exists in the photo gallery.
   *
   * This should be run when the photo gallery is already loaded.
   *
   * @param page - The Playwright page object
   * @param photoTitle - The title of the photo to check for
   * @param shouldExist - Whether the photo should exist (true) or not exist (false)
   * @param timeout - Optional timeout in milliseconds for waiting (default: 2000ms)
   */
  const verifyPhotoInGallery = async (
    page: Page,
    photoTitle: string,
    shouldExist: boolean,
    timeout: number = 2000,
  ) => {
    await page.waitForTimeout(timeout);
    const photoLocator = page
      .locator(`#photo-grid >> text=${photoTitle}`)
      .first();

    if (shouldExist) {
      await expect(photoLocator).toBeVisible();
    } else {
      await expect(photoLocator).not.toBeVisible();
    }
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
    const {
      title: testTitle,
      description: testDescription,
      tag: testTag,
    } = getTestPhotoData();

    await login({
      page,
      request,
      email: testUserEmail,
    });

    // Here, we navigate to the photo gallery
    await page.goto("/photo-gallery");

    // Here, we wait for the page to load
    await expect(page.locator("#photo-grid")).toBeVisible();

    // Here, we verify the photo title doesn't exist yet
    await verifyPhotoInGallery(page, testTitle, false, 0);

    // Here, we click the add photo button
    await page.locator("#add-photo-button").click();

    // Here, we wait for the upload modal to appear
    await expect(page.locator('input[name="title"]').first()).toBeVisible();

    // Here, we upload a test image
    const testImagePath = path.join(
      import.meta.dirname,
      "../fixtures/test-image.jpg",
    );
    const fileInput = page.locator('input[type="file"]').first();
    await fileInput.setInputFiles(testImagePath);

    // Here, we fill in the photo title
    await page.locator('input[name="title"]').first().fill(testTitle);

    // Here, we fill in the photo description
    await page
      .locator('textarea[name="description"]')
      .first()
      .fill(testDescription);

    // Here, we add a tag to the photo
    const tagInput = page.locator('input[placeholder="Create new tag..."]');
    await tagInput.fill(testTag);
    await page.locator('button:has-text("Add Tag")').first().click();

    // Here, we wait for the tag to be created
    await expect(page.locator(`text=${testTag}`).first()).toBeVisible();

    // Here, we click the Upload button
    await page.locator('button[type="submit"]:has-text("Upload")').click();

    // Here, we wait for the upload modal to close
    await expect(page.locator('input[name="title"]').first()).not.toBeVisible({
      timeout: 10000,
    });

    // Here, we verify the photo appears in the gallery
    // Here, we verify the photo title exists in the gallery
    await verifyPhotoInGallery(page, testTitle, true);

    // Here, we locate the uploaded photo in the gallery
    const uploadedPhotoContainer = page
      .locator(`#photo-grid >> text=${testTitle}`)
      .first();
    await expect(uploadedPhotoContainer).toBeVisible();

    // Here, we open the photo modal
    const photoImage = page.locator("#photo-item").first();
    await photoImage.click();
    await expect(page.locator("#photo-modal")).toBeVisible();

    // Here, we verify the modal shows the correct photo details
    await expect(
      page.locator("#modal-details >> h2", { hasText: testTitle }),
    ).toBeVisible();

    // Here, we click the delete button (trash icon) in the modal
    await page.locator("#modal-delete").click();

    // Here, we wait for the deletion confirmation modal to appear
    await expect(
      page.locator("text=Are you sure you want to delete this photo?"),
    ).toBeVisible();

    // Here, we verify the photo title appears in the confirmation message
    await expect(page.locator(`text="${testTitle}"`).last()).toBeVisible();

    // Here, we click the "Delete Photo" button to confirm deletion
    await page.locator('button:has-text("Delete Photo")').click();

    // Here, we wait for the deletion to complete
    // Here, we wait for the modal to close
    await expect(page.locator("#photo-modal")).not.toBeVisible({
      timeout: 10000,
    });

    // Here, we verify the photo is removed from the gallery
    await verifyPhotoInGallery(page, testTitle, false);
  });
});
