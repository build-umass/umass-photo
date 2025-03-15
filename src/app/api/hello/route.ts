import { randomBytes } from 'crypto';
import dotenv from 'dotenv'
import { createClient } from '@supabase/supabase-js'

dotenv.config()

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(request: Request) {
  const supabaseApiKey = process.env.SUPABASE_API_KEY;
  const supabaseUrl = process.env.SUPABASE_URL;
  if(!supabaseApiKey) throw new Error("No API key found!");
  if(!supabaseUrl) throw new Error("No Supabase URL found!");

  const client = createClient(supabaseUrl, supabaseApiKey);

  client.storage
    .from("hello-world")
    .upload(
      `${randomBytes(20).toString('base64url')}.txt`,
      Buffer.from("Hello, Nathan!", 'utf-8')
    )
  return new Response('Test');
}