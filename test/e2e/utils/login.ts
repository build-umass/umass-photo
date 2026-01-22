import { APIRequestContext, Page } from "@playwright/test";
import { MailpitMessage, waitForMessage } from "./mailpit";

/**
 * Log into the application using a one-time code sent via email.
 * @param param0.page the page instance used to login.
 * @param param0.request the API request context used to interact with the backend.
 * @param param0.email the email address used for login.
 */
export async function login({
  page,
  request,
  email,
}: {
  page: Page;
  request: APIRequestContext;
  email: string;
}) {
  // Log in before running the tests
  await page.goto("/login");

  // Here, we click on the one-time code navigator.
  await page.locator('button:has-text("One-Time Code")').click();

  // Here, we fill in the email to request a login code.
  await page.locator('input[name="email"]').fill(email);
  await page.locator('button[type="submit"]').click();

  // Here, we wait for the email to arrive in Mailpit.
  const latestMessage: MailpitMessage = await waitForMessage(request, email);
  const code = /code: ([0-9]+)/.exec(latestMessage.Text)?.[1] || "";
  if (!code) {
    throw new Error("Failed to extract OTP code from email.");
  }

  console.debug(`Code received: ${code}`);

  // Here, we fill in the OTP form.");
  // Source - https://stackoverflow.com/a/78753805
  // Posted by Guillaume Brioudes
  // Retrieved 2026-01-21, License - CC BY-SA 4.0
  await page.waitForURL(/.*\/otp(?!\/)/);
  await page.fill('input[name="otp"]', code);
  await page.click('button[type="submit"]');

  // Here, we wait to return to the homepage
  await page.waitForURL("/");
}
