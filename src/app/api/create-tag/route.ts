import { NextRequest } from "next/server";
import { attachCookies, getUserClient } from "@/app/utils/supabase/client";

export async function POST(request: NextRequest) {
  try {
    const client = getUserClient(request);

    const {
      data: { user },
    } = await client.auth.getUser();
    if (!user) {
      const response = new Response(
        JSON.stringify({ error: "Not authenticated" }),
        {
          status: 401,
          headers: { "Content-Type": "application/json" },
        },
      );
      return attachCookies(client, response);
    }
    const body = await request.json();
    const { name } = body;

    if (!name || typeof name !== "string" || !name.trim()) {
      const response = new Response(
        JSON.stringify({ error: "Tag name is required" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        },
      );
      return attachCookies(client, response);
    }

    const trimmedName = name.trim();

    const { error } = await client.from("tag").upsert([{ name: trimmedName }], {
      onConflict: "name",
      ignoreDuplicates: true,
    });

    if (error) {
      console.error("Database error creating tag:", error);
      const response = new Response(
        JSON.stringify({ error: "Failed to create tag" }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        },
      );
      return attachCookies(client, response);
    }

    const response = new Response(
      JSON.stringify({
        success: true,
        tag: { name: trimmedName },
      }),
      {
        status: 201,
        headers: { "Content-Type": "application/json" },
      },
    );

    return attachCookies(client, response);
  } catch (error) {
    console.error("Error in create-tag API:", error);
    const response = new Response(
      JSON.stringify({ error: "Internal server error" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
    return response;
  }
}
