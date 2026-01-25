import { createBrowserClient } from "@supabase/ssr";
import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "./database.types";

const supabaseUrl = (() => {
  const value = process.env.API_URL || process.env.SUPABASE_URL;
  if (value === undefined)
    throw new Error("API_URL is not defined in environment variables");
  return value;
})();

const supabaseAnonKey = (() => {
  const value = process.env.ANON_KEY || process.env.SUPABASE_ANON_KEY;
  if (!value)
    throw new Error("ANON_KEY is not defined in environment variables");
  return value;
})();

export function createClient(): SupabaseClient<Database> {
  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}
