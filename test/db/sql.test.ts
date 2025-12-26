import dotenv from "dotenv";
import { insertTestData as insertTestData } from "./generateTestData";
import { afterAll, beforeAll, describe, it, expect } from "vitest";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { Database } from "@/app/utils/supabase/database.types";

dotenv.config();

describe("Database Rule Tests", () => {
  let supabase: SupabaseClient<Database>;

  beforeAll(async () => {
    const apiUrl = process.env.API_URL;
    const supabaseServiceKey = process.env.SERVICE_ROLE_KEY;

    if (!apiUrl) throw new Error("Supabase URL not found in environment!");
    if (!supabaseServiceKey)
      throw new Error("Supabase service role key not found in environment!");

    supabase = createClient<Database>(apiUrl, supabaseServiceKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
      db: {
        schema: "public",
      },
    });

    const seedResult = await insertTestData(supabase);
    if (seedResult.error)
      throw new Error(
        `Failed to insert test data: ${JSON.stringify(seedResult.error)}`,
      );
  });

  afterAll(async () => {});

  type DbTableName = keyof Database["public"]["Tables"];

  const expectedRowCounts: Partial<Record<DbTableName, number>> = {
    photoclubrole: 2,
    photoclubuser: 2,
    photo: 9,
    tag: 5,
    phototag: 11,
    event: 5,
  };

  for (const [tableName, expectedCount] of Object.entries(
    expectedRowCounts,
  ) as [DbTableName, number][]) {
    it(`should have ${expectedCount} records in ${tableName} table`, async () => {
      const { data, error } = await supabase.from(tableName).select("*");

      expect(error, `Error fetching records from ${tableName}`).toBeNull();
      expect(data).toHaveLength(expectedCount);
    });
  }
});
