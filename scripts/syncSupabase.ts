import { parseArgs } from "node:util";
import { syncSupabase } from "./lib/syncSupabase.ts";

const {
  values: { name, help },
} = parseArgs({
  args: process.argv.slice(2),
  options: {
    name: {
      type: "string",
      short: "n",
    },
    help: {
      type: "boolean",
      short: "h",
    },
  },
  allowPositionals: false,
});

if (help) {
  console.log(
    `
Usage: tsx syncSupabase.ts --name <migration-name>

Syncs Supabase database and types after a schema modification.

Arguments:
  migration-name         Name of the migration file to create

Options:
  -n, --name <name>      Migration name
  -h, --help             Show this help message

Examples:
  tsx syncSupabase.ts --name add_user_table
`.trim(),
  );
  process.exit(0);
}

if (!name) {
  console.error(
    `
Error: Migration name is required

Usage: tsx syncSupabase.ts --name <migration-name>
       tsx syncSupabase.ts -n <migration-name>
Run with --help for more information
`.trim(),
  );
  process.exit(1);
}

try {
  syncSupabase(name);
} catch (error) {
  console.error("Sync failed:", error);
  process.exit(1);
}
