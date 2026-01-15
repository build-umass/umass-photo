import { NextRequest, NextResponse } from "next/server";
import { getAdminClient } from "@/app/utils/supabase/client";
import { sendMail } from "@/app/utils/sendMail";

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

  const emails = users.map((u) => u.email).filter((email) => email); // Ensure no null/empty emails

  if (emails.length === 0) {
    return NextResponse.json({ message: "No valid email addresses found." });
  }

  for (const event of events) {
    const subject = `Upcoming Event: ${event.name}`;
    const text = `Hi there,\n\nWe have an upcoming event: ${event.name}!\n\n${event.description}\n\nDate: ${new Date(event.startdate).toLocaleString()}\n\nSee you there!`;

    for (const recipient of emails) {
      try {
        await sendMail({ recipientEmail: recipient, subject, text });
      } catch (e) {
        console.error(e);
      }
    }
  }

  return NextResponse.json({});
}
