import { createClient } from "@supabase/supabase-js";
import { insertTestData } from "../test/db/generateTestData";
import { Database } from "@/app/utils/supabase/database.types";

const apiUrl = process.env.API_URL || process.env.SUPABASE_URL;
const supabaseServiceKey =
  process.env.SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!apiUrl) throw new Error("Supabase URL not found in environment!");
if (!supabaseServiceKey)
  throw new Error("Supabase service role key not found in environment!");

const supabase = createClient<Database>(apiUrl, supabaseServiceKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
  db: {
    schema: "public",
  },
});

await insertTestData(supabase);
