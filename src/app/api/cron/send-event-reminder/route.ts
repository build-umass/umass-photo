import { NextRequest } from "next/server";
import { getAdminClient } from "@/app/utils/supabase/server";
import { sendMail } from "@/app/utils/sendMail";

export async function GET(request: NextRequest) {
  const CRON_SECRET = process.env.CRON_SECRET;
  if (!CRON_SECRET) {
    throw new Error("CRON_SECRET is not defined in environment variables");
  }

  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${CRON_SECRET}`) {
    return new Response("Unauthorized", {
      status: 401,
    });
  }

  const supabase = await getAdminClient();

  const now = new Date();
  const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);

  const { data: events, error: eventError } = await supabase
    .from("event")
    .select("*")
    .gte("enddate", now.toISOString())
    .lt("enddate", tomorrow.toISOString());

  if (eventError) {
    return Response.json({ error: eventError.message }, { status: 500 });
  }

  // if (!events || events.length === 0) {
  //   return Response.json({ message: "No upcoming events found." });
  // }

  const { data: users, error: userError } = await supabase
    .from("photoclubuser")
    .select("email")
    .eq("email_opt_in", true);

  if (userError) {
    return Response.json({ error: userError.message }, { status: 500 });
  }

  if (!users || users.length === 0) {
    return Response.json({ message: "No opted-in users found." });
  }

  const emails = users.map((u) => u.email).filter((email) => email); // Ensure no null/empty emails

  if (emails.length === 0) {
    return Response.json({ message: "No valid email addresses found." });
  }

  for (const event of events) {
    const subject = `Upcoming Event: ${event.name}`;
    const text = `Hi there,

We have an upcoming event that is about to finish: ${event.name}!

${event.description}

Date: ${new Date(event.startdate).toLocaleString()}

See you there!`;

    for (const recipient of emails) {
      try {
        await sendMail({ recipientEmail: recipient, subject, text });
      } catch (e) {
        console.error(e);
      }
    }
  }


  return Response.json({"Success": true});
}
