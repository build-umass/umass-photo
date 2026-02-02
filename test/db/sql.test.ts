import dotenv from "dotenv";
import { beforeAll, describe, expect, it } from "vitest";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { Database } from "@/app/utils/supabase/database.types";

dotenv.config();

describe("Smoke Test", () => {
  let supabase: SupabaseClient<Database>;

  beforeAll(async () => {
    const apiUrl = process.env.API_URL || process.env.SUPABASE_URL;
    const supabaseServiceKey =
      process.env.SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!apiUrl) throw new Error("Supabase URL not found in environment!");
    if (!supabaseServiceKey)
      throw new Error("Supabase service role key not found in environment!");

    supabase = createClient<Database>(apiUrl, supabaseServiceKey);
  });

  it("should connect to Supabase", async () => {
    const { error } = await supabase.auth.getClaims();
    expect(error).toBeNull();
  });
});
