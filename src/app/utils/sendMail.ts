import Mailgun from "mailgun.js";
import FormData from "form-data";

const MAIL_SENDER = "UMass Photography Club";
const MAIL_LOCAL = "no-reply";
const MAIL_DOMAIN = "sandboxfe1ea50011674e95886b9c3ceb577dad.mailgun.org";

const MAILGUN_API_KEY = process.env.MAILGUN_API_KEY;
if (MAILGUN_API_KEY === undefined)
  throw new Error("MAILGUN_API_KEY is not defined");

const MODE = process.env.MODE;
if (MODE === undefined) throw new Error("MODE is not defined");

const MAILPIT_URL = process.env.MAILPIT_URL;

const mailgun = new Mailgun(FormData);
const mailgunClient = mailgun.client({
  username: "api",
  key: MAILGUN_API_KEY,
});

/**
 * Send a non-Supabase email to a particular email address.
 *
 * If testing mode is enabled, the mail will be sent to Mailpit.
 * @param param0.recipientEmail the email address of the recipient.
 * @param param0.subject the subject line of the email.
 * @param param0.text the body of the email.
 * @returns the result of the Mailgun API call or the Mailpit API call. Use for debugging only.
 */
export async function sendMail({
  recipientEmail,
  subject,
  text,
}: {
  recipientEmail: string;
  subject: string;
  text: string;
}) {
  if (MODE === "testing") {
    if (MAILPIT_URL === undefined)
      throw new Error("MAILPIT_URL is not defined");
    // Based on https://mailpit.axllent.org/docs/api-v1/view.html#post-/api/v1/send
    const result = await fetch(`${MAILPIT_URL}/api/v1/send`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        From: {
          email: `${MAIL_LOCAL}@${MAIL_DOMAIN}`,
          name: MAIL_SENDER,
        },
        To: [{ email: recipientEmail }],
        Subject: subject,
        Text: text,
      }),
    });
    const resultData = await result.json();
    return resultData;
  } else {
    const result = await mailgunClient.messages.create(MAIL_DOMAIN, {
      from: `${MAIL_SENDER} <${MAIL_LOCAL}@${MAIL_DOMAIN}>`,
      to: [recipientEmail],
      subject: subject,
      text: text,
    });
    return result;
  }
}
