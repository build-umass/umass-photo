import { expect } from "chai";
import dotenv from "dotenv";
import postgres from 'postgres'
import fs from 'fs/promises';
import path from "path";
import { seedTestData, cleanupTestUsers } from "./seedTestData";
import { afterAll, beforeAll, describe, it } from "vitest"

dotenv.config();

async function wipeTables() {
  const connectionString = process.env.DATABASE_URL
  if (!connectionString) throw new Error("No database connection string found!");
  const sql = postgres(connectionString)

  const res = await sql`
      SELECT * FROM information_schema.tables WHERE table_schema='public';
    `;

  console.log(JSON.stringify(res, null, 2));

  for (const tableMetadata of res) {
    const tableName = tableMetadata.table_name;
    console.log(`Removing table: ${tableName}`);
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
  let createdUsers: Array<{ id: string; email: string; password: string; username: string; role: string }> | undefined;

  beforeAll(async () => {
    await wipeTables();
    await runQueryFile(path.join(import.meta.dirname, '..', 'sql', 'setup.sql'));
    const result = await seedTestData();
    createdUsers = result.users;
  });

  afterAll(async () => {
    // Cleanup test users created via Supabase
    if (createdUsers && createdUsers.length > 0) {
      await cleanupTestUsers(createdUsers);
    }
  });

  it("should be a working example test", () => {
    expect(2 + 2).to.equal(4);
  });
});
