import dotenv from "dotenv";
import path from "path";
import { insertTestData as insertTestData } from "./generateTestData";
import { afterAll, beforeAll, describe, it, expect } from "vitest"
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { Database } from "@/app/utils/supabase/database.types";
import { runQueryFile, deleteAllTables, reloadSchema } from "./postgresOps";

dotenv.config();

describe("Database Rule Tests", () => {
  let supabase: SupabaseClient<Database>;

  beforeAll(async () => {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_API_KEY;
    const databaseUrl = process.env.DATABASE_URL;

    if (!supabaseUrl) throw new Error('Supabase URL not found in environment!');
    if (!supabaseServiceKey) throw new Error('Supabase service role key not found in environment!');
    if (!databaseUrl) throw new Error('Database URL not found in environment!');

    const wipeResult = await deleteAllTables(databaseUrl);
    if (wipeResult.error) throw new Error(`Failed to wipe tables: ${JSON.stringify(wipeResult.error)}`);

    const setupResult = await runQueryFile(databaseUrl, path.join(import.meta.dirname, '..', '..', 'sql', 'setup.sql'));
    if (setupResult.error) throw new Error(`Failed to run setup.sql: ${JSON.stringify(setupResult.error)}`);

    const refreshResult = await reloadSchema(databaseUrl);
    if (refreshResult.error) throw new Error(`Failed to reload schema: ${JSON.stringify(refreshResult.error)}`);

    supabase = createClient<Database>(supabaseUrl, supabaseServiceKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
      db: {
        schema: 'public',
      },
    });

    const seedResult = await insertTestData(supabase);
    if (seedResult.error) throw new Error(`Failed to insert test data: ${JSON.stringify(seedResult.error)}`);
  });

  afterAll(async () => {
  });

  type DbTableName = keyof Database['public']['Tables'];

  const expectedRowCounts: Partial<Record<DbTableName, number>> = {
    photoclubrole: 3,
    photoclubuser: 2,
    photo: 9,
    tag: 5,
    phototag: 11,
    event: 5,
  };

  for (const [tableName, expectedCount] of Object.entries(expectedRowCounts) as [DbTableName, number][]) {
    it(`should have ${expectedCount} records in ${tableName} table`, async () => {
      const { data, error } = await supabase
        .from(tableName)
        .select('*');

      expect(error, `Error fetching records from ${tableName}`).toBeNull();
      expect(data).toHaveLength(expectedCount);
    });
  }
});
