import { APIRequestContext } from "@playwright/test";

interface MailpitConfig {
  url: string;
}

/**
 * Mailpit message type based on Mailpit API v1
 * From https://mailpit.axllent.org/docs/api-v1/view.html#get-/api/v1/messages
 */
export type MailpitMessageSummary = {
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
  Read: boolean;
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
};

/**
 * Full Mailpit message object
 */
export type MailpitMessage = {
  Attachments: {
    ContentID: string;
    ContentType: string;
    FileName: string;
    PartID: string;
    Size: number;
  }[];
  Bcc: {
    Address: string;
    Name: string;
  }[];
  Cc: {
    Address: string;
    Name: string;
  }[];
  Date: string;
  From: {
    Address: string;
    Name: string;
  };
  HTML: string;
  ID: string;
  Inline: {
    ContentID: string;
    ContentType: string;
    FileName: string;
    PartID: string;
    Size: number;
  }[];
  ListUnsubscribe: {
    Errors: string;
    Header: string;
    HeaderPost: string;
    Links: string[];
  };
  MessageID: string;
  ReplyTo: {
    Address: string;
    Name: string;
  }[];
  ReturnPath: string;
  Size: number;
  Subject: string;
  Tags: string[];
  Text: string;
  To: {
    Address: string;
    Name: string;
  }[];
  Username: string;
};

/**
 * A successful response body to a mailpit message list request.
 * From https://mailpit.axllent.org/docs/api-v1/view.html#get-/api/v1/messages.
 */
export type MailpitMessageResponse = {
  messages: MailpitMessageSummary[];
  messages_count: number;
  messages_unread: number;
  start: number;
  tags: string[];
  total: number;
  unread: number;
};

/**
 * Gets the Mailpit URL from environment variables and validates it
 */
export function getMailpitConfig(): MailpitConfig {
  const url = process.env.MAILPIT_URL;
  if (!url) {
    throw new Error("MAILPIT_URL environment variable is not set");
  }
  return { url };
}

/**
 * Fetches all messages from Mailpit using the API
 * @param request - The Playwright API request context
 * @returns The Mailpit message response
 */
export async function getMailpitMessages(
  request: APIRequestContext,
): Promise<MailpitMessageResponse> {
  const config = getMailpitConfig();
  const response = await request.get(`${config.url}/api/v1/messages`);

  if (!response.ok()) {
    throw new Error(
      `Failed to fetch Mailpit messages: ${response.status()} ${response.statusText()}`,
    );
  }

  return (await response.json()) as MailpitMessageResponse;
}

/**
 * Finds messages sent to a specific email address
 * @param request - The Playwright API request context
 * @param recipientEmail - The email address to filter by
 * @returns Array of messages sent to the recipient
 */
export async function getMessagesForRecipient(
  request: APIRequestContext,
  recipientEmail: string,
): Promise<MailpitMessageSummary[]> {
  const { messages } = await getMailpitMessages(request);
  return messages.filter((message) =>
    message.To.some((recipient) => recipient.Address === recipientEmail),
  );
}

/**
 * Finds a message by subject line
 * @param request - The Playwright API request context
 * @param subject - The subject line to search for
 * @param recipientEmail - Optional email address to filter by recipient
 * @returns The first message matching the subject, or undefined if not found
 */
export async function findMessageBySubject(
  request: APIRequestContext,
  subject: string,
  recipientEmail?: string,
): Promise<MailpitMessageSummary | undefined> {
  const { messages } = await getMailpitMessages(request);

  let filteredMessages = messages;
  if (recipientEmail) {
    filteredMessages = messages.filter((message) =>
      message.To.some((recipient) => recipient.Address === recipientEmail),
    );
  }

  return filteredMessages.find((message) => message.Subject === subject);
}

/**
 * Waits for an unread message to arrive in Mailpit and marks it as read.
 * @param request - The Playwright API request context
 * @param recipientEmail - Optional email address to filter by recipient
 * @returns The most recent message, or undefined if no messages exist
 */
export async function waitForMessage(
  request: APIRequestContext,
  recipientEmail?: string,
): Promise<MailpitMessage> {
  let messageList: MailpitMessageSummary[] = [];
  while (messageList.length === 0) {
    const { messages } = await getMailpitMessages(request);
    if (recipientEmail) {
      messageList = messages.filter((message) =>
        message.To.some(
          (recipient) =>
            recipient.Address === recipientEmail && message.Read === false,
        ),
      );
    } else {
      messageList = messages.filter((message) =>
        message.To.some(() => message.Read === false),
      );
    }
    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  const config = getMailpitConfig();
  const response = await request.get(
    `${config.url}/api/v1/message/${messageList[0].ID}`,
  );
  if (response.status() >= 400) {
    throw new Error(
      `Failed to fetch Mailpit message ID ${messageList[0].ID}: ${response.status()} ${response.statusText()}`,
    );
  }

  return (await response.json()) as MailpitMessage;
}
