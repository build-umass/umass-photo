import { test, expect } from "@playwright/test";
import { getAdminClient } from "../utils/adminClient";
import { randomInt, randomUUID } from "crypto";

const CRON_SECRET = process.env.CRON_SECRET;
if (!CRON_SECRET) {
  throw new Error("CRON_SECRET is not defined in environment variables");
}

const MAILPIT_URL = process.env.MAILPIT_URL;
if (!MAILPIT_URL) {
  throw new Error("MAILPIT_URL is not defined in environment variables");
}

/**
 * A successful response body to a mailpit message list request.
 * From https://mailpit.axllent.org/docs/api-v1/view.html#get-/api/v1/messages.
 */
type MailpitMessageResponse = {
  messages: {
    Attachments: number;
    Bcc: {
      Address: string;
      Name: string;
    }[];
    Cc: {
      Address: string;
      Name: string;
    }[];
    Created: string;
    From: {
      Address: string;
      Name: string;
    };
    ID: string;
    MessageID: string;
    Read: false;
    ReplyTo: {
      Address: string;
      Name: string;
    }[];
    Size: number;
    Snippet: string;
    Subject: string;
    Tags: string[];
    To: {
      Address: string;
      Name: string;
    }[];
    Username: string;
  }[];
  messages_count: number;
  messages_unread: number;
  start: number;
  tags: string[];
  total: number;
  unread: number;
};

test.describe("Cron Event Reminder API", () => {
  const supabase = getAdminClient();

  const userId = randomUUID();
  const deduplicationId = randomInt(100000, 999999);
  const userEmail = `test-cron-${deduplicationId}@example.com`;
  const eventName = `Cron Test Event ${deduplicationId}`;
  const eventTag = `CronTestTag-${deduplicationId}`;

  test.afterAll(async () => {
    await supabase.from("tag").delete().eq("name", eventTag);
    await supabase.auth.admin.deleteUser(userId);
  });

  test("should send email reminder for upcoming event", async ({ request }) => {
    // #region Create test user
    const { error: ensureRoleError } = await supabase
      .from("photoclubrole")
      .upsert({
        roleid: "member",
        is_admin: false,
      });
    if (ensureRoleError) {
      console.error("Error creating member role:", ensureRoleError);
      throw ensureRoleError;
    }

    // Create a user
    const { error: authError } = await supabase.auth.admin.createUser({
      id: userId,
      email: userEmail,
      email_confirm: true,
    });
    if (authError) {
      console.error("Auth user creation error:", authError);
      throw authError;
    }

    // Create the profile
    const { error: profileError } = await supabase
      .from("photoclubuser")
      .insert({
        id: userId,
        email: userEmail,
        username: `testuser`,
        bio: "Cron Test Bio",
        role: "member",
      });
    if (profileError) {
      console.error("Profile creation error:", profileError);
      throw profileError;
    }
    // #endregion

    // #region Create an event starting 2 days ago and ending in an hour
    const now = new Date();
    const startTime = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000);
    const endTime = new Date(now.getTime() + 1 * 60 * 60 * 1000);

    const { error: tagError } = await supabase
      .from("tag")
      .insert({ name: eventTag });
    if (tagError) {
      console.error("Tag creation error:", tagError);
      throw tagError;
    }

    const { error: eventError } = await supabase.from("event").insert({
      name: eventName,
      description: "This is a test event for cron reminders.",
      startdate: startTime.toISOString(),
      enddate: endTime.toISOString(),
      herofile: "placeholder.png",
      tag: eventTag,
    });
    if (eventError) {
      console.error("Event creation error:", eventError);
      throw eventError;
    }
    // #endregion

    // Trigger the Cron Job
    const response = await request.get("/api/cron/send-event-reminder", {
      headers: {
        Authorization: `Bearer ${CRON_SECRET}`,
      },
    });
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body).toEqual({});

    // Verify Email in Mailpit
    const mailpitResponse = await request.get(`${MAILPIT_URL}/api/v1/messages`);
    expect(mailpitResponse.ok());
    const { messages } =
      (await mailpitResponse.json()) as MailpitMessageResponse;

    // Expect a message to the test user about the event
    /** list of emails directed to test user */
    const relevantMessages = messages.filter((message) =>
      message.To.some((recipient) => recipient.Address === userEmail),
    );
    expect(
      relevantMessages.some(
        (message) => message.Subject === `Upcoming Event: ${eventName}`,
      ),
    );
  });
});
