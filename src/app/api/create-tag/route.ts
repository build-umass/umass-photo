import dotenv from "dotenv";
import { NextRequest } from "next/server";
import { attachCookies, getUserClient } from "@/app/utils/supabase/client";

dotenv.config();

export async function POST(request: NextRequest) {
  try {
    const client = getUserClient(request);
    
    // Check if user is authenticated
    const { data: { user } } = await client.auth.getUser();
    if (!user) {
      const response = new Response(JSON.stringify({ error: 'Not authenticated' }), { 
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
      return attachCookies(client, response);
    }

    // Get tag name from request body
    const body = await request.json();
    const { name } = body;

    // Validate tag name
    if (!name || typeof name !== 'string' || !name.trim()) {
      const response = new Response(JSON.stringify({ error: 'Tag name is required' }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
      return attachCookies(client, response);
    }

    const trimmedName = name.trim();

    // Insert tag into database (use upsert to avoid duplicates)
    const { error } = await client
      .from('tag')
      .upsert([{ name: trimmedName }], { 
        onConflict: 'name',
        ignoreDuplicates: true 
      });

    if (error) {
      console.error('Database error creating tag:', error);
      const response = new Response(JSON.stringify({ error: 'Failed to create tag' }), { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
      return attachCookies(client, response);
    }

    // Return success response
    const response = new Response(JSON.stringify({ 
      success: true, 
      tag: { name: trimmedName } 
    }), { 
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });

    return attachCookies(client, response);
  } catch (error) {
    console.error('Error in create-tag API:', error);
    const response = new Response(JSON.stringify({ error: 'Internal server error' }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
    return response;
  }
}
