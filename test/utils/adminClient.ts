import { Database } from "@/app/utils/supabase/database.types";
import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = (() => {
  const value = process.env.API_URL || process.env.SUPABASE_URL;
  if (value === undefined)
    throw new Error("API_URL is not defined in environment variables");
  return value;
})();

const supabaseServiceRoleKey = (() => {
  const value =
    process.env.SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!value)
    throw new Error("SERVICE_ROLE_KEY is not defined in environment variables");
  return value;
})();

export function getAdminClient(): SupabaseClient<Database> {
  return createClient(supabaseUrl, supabaseServiceRoleKey);
}
