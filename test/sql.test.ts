import dotenv from "dotenv";
import path from "path";
import { seedTestData } from "./seedTestData";
import { afterAll, beforeAll, describe, it, expect } from "vitest"
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { Database } from "@/app/utils/supabase/database.types";
import { runQueryFile, deleteAllTables } from "./postgresOps";

dotenv.config();

describe("Database Rule Tests", () => {
  let supabase: SupabaseClient<Database>;

  beforeAll(async () => {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_API_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
    const databaseUrl = process.env.DATABASE_URL;

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Supabase URL or service key not found in environment!');
    }

    if (!databaseUrl) {
      throw new Error('Database URL not found in environment!');
    }

    supabase = createClient<Database>(supabaseUrl, supabaseServiceKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
      db: {
        schema: 'public',
      },
    });

    const wipeResult = await deleteAllTables(databaseUrl);
    if (wipeResult.error) {
      throw new Error(`Failed to wipe tables: ${wipeResult.error}`);
    }

    const setupResult = await runQueryFile(databaseUrl, path.join(import.meta.dirname, '..', 'sql', 'setup.sql'));
    if (setupResult.error) {
      throw new Error(`Failed to run setup.sql: ${setupResult.error}`);
    }

    const seedResult = await seedTestData(supabase);
    if (seedResult.error) {
      throw new Error(`Failed to seed test data: ${seedResult.error}`);
    }
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
