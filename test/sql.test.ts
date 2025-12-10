import dotenv from "dotenv";
import postgres from 'postgres'
import fs from 'fs/promises';
import path from "path";
import { seedTestData } from "./seedTestData";
import { afterAll, beforeAll, describe, it, expect } from "vitest"
import { createClient } from "@supabase/supabase-js";
import { Database } from "@/app/utils/supabase/database.types";

dotenv.config();

async function wipeTables() {
  const connectionString = process.env.DATABASE_URL
  if (!connectionString) throw new Error("No database connection string found!");
  const sql = postgres(connectionString)

  const res = await sql`
      SELECT * FROM information_schema.tables WHERE table_schema='public';
    `;

  for (const tableMetadata of res) {
    const tableName = tableMetadata.table_name;
    await sql`
        DROP TABLE IF EXISTS ${sql(tableName)} CASCADE;
      `;
  }
  await sql.end();
}

async function runQueryFile(filePath: string) {
  const connectionString = process.env.DATABASE_URL
  if (!connectionString) throw new Error("No database connection string found!");
  const sql = postgres(connectionString)

  const query = await fs.readFile(filePath, 'utf-8');
  await sql.unsafe(query);
  await sql.end();
}

describe("Database Rule Tests", () => {
  beforeAll(async () => {
    await wipeTables();
    await runQueryFile(path.join(import.meta.dirname, '..', 'sql', 'setup.sql'));
    await seedTestData();
  });

  afterAll(async () => {
  });

  it("should have the correct number of records in each table", async () => {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_API_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Supabase URL or service key not found in environment!');
    }

    const supabase = createClient<Database>(supabaseUrl, supabaseServiceKey, { 
      auth: { 
        persistSession: false,
        autoRefreshToken: false,
      },
      db: {
        schema: 'public',
      },
    });

    // Check photoclubrole table - should have 3 roles
    const { data: roles, error: rolesError } = await supabase
      .from('photoclubrole')
      .select('*');
    expect(rolesError, 'Error fetching photoclubrole records').toBeNull();
    expect(roles).to.have.lengthOf(3);

    // Check photoclubuser table - should have 2 users
    const { data: users, error: usersError } = await supabase
      .from('photoclubuser')
      .select('*');
    if (usersError) {
      console.error('Error fetching users:', usersError);
    }
    expect(usersError, 'Error fetching photoclubuser records').toBeNull();
    expect(users).to.have.lengthOf(2);

    // Check photo table - should have 9 photos
    const { data: photos, error: photosError } = await supabase
      .from('photo')
      .select('*');
    expect(photosError, 'Error fetching photo records').toBeNull();
    expect(photos).to.have.lengthOf(9);

    // Check tag table - should have 5 tags
    const { data: tags, error: tagsError } = await supabase
      .from('tag')
      .select('*');
    expect(tagsError, 'Error fetching tag records').toBeNull();
    expect(tags).to.have.lengthOf(5);

    // Check phototag table - should have 11 photo-tag relationships
    const { data: phototags, error: phototagsError } = await supabase
      .from('phototag')
      .select('*');
    expect(phototagsError, 'Error fetching phototag records').toBeNull();
    expect(phototags).to.have.lengthOf(11);

    // Check event table - should have 5 events
    const { data: events, error: eventsError } = await supabase
      .from('event')
      .select('*');
    expect(eventsError, 'Error fetching event records').toBeNull();
    expect(events).to.have.lengthOf(5);
  });
});
