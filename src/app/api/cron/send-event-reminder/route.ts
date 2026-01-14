import { NextRequest, NextResponse } from "next/server";
import { getAdminClient } from "@/app/utils/supabase/client";
import Mailgun from "mailgun.js";
import FormData from "form-data";

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response("Unauthorized", {
      status: 401,
    });
  }

  const supabase = getAdminClient();

  const now = new Date();
  const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);

  const { data: events, error: eventError } = await supabase
    .from("event")
    .select("*")
    .gte("startdate", now.toISOString())
    .lt("startdate", tomorrow.toISOString());

  if (eventError) {
    return NextResponse.json({ error: eventError.message }, { status: 500 });
  }

  if (!events || events.length === 0) {
    return NextResponse.json({ message: "No upcoming events found." });
  }

  const { data: users, error: userError } = await supabase
    .from("photoclubuser")
    .select("email");

  if (userError) {
    return NextResponse.json({ error: userError.message }, { status: 500 });
  }

  if (!users || users.length === 0) {
    return NextResponse.json({ message: "No users found." });
  }

  const mailgun = new Mailgun(FormData);
  const mg = mailgun.client({
    username: "api",
    key: process.env.MAILGUN_API_KEY || "",
    url: "https://api.mailgun.net",
  });

  const domain = process.env.MAILGUN_DOMAIN || "";
  const sender = `UMass Photo Club <noreply@${domain}>`;
  const results = [];
  const emails = users.map((u) => u.email).filter((email) => email); // Ensure no null/empty emails

  if (emails.length === 0) {
    return NextResponse.json({ message: "No valid email addresses found." });
  }

  for (const event of events) {
    const subject = `Upcoming Event: ${event.name}`;
    const text = `Hi there,\n\nWe have an upcoming event: ${event.name}!\n\n${event.description}\n\nDate: ${new Date(event.startdate).toLocaleString()}\n\nSee you there!`;

    try {
      // Sending with BCC to hide recipients from each other
      const msg = await mg.messages.create(domain, {
        from: sender,
        to: sender,
        bcc: emails,
        subject: subject,
        text: text,
      });
      results.push({ event: event.name, status: "sent", id: msg.id });
    } catch (e) {
      console.error(e);
      results.push({ event: event.name, status: "error", error: e });
    }
  }

  return NextResponse.json({ results });
}
