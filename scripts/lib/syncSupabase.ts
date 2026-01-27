import { spawnSync } from "child_process";
import { chdir } from "process";
import { resolve } from "path";
import { writeFileSync } from "fs";

/**
 * Syncs the Supabase database and TypeScript types after a schema modification.
 *
 * This function performs the following steps:
 * 1. Stops any running Supabase instances
 * 2. Generates a new migration file with the provided name
 * 3. Starts Supabase
 * 4. Generates updated TypeScript types from the database schema
 *
 * @param migrationName - The name of the migration file to create (without extension)
 * @throws {Error} If any of the Supabase commands fail
 *
 * @example
 * ```typescript
 * syncSupabase("add_user_table");
 * ```
 */
export function syncSupabase(migrationName: string): void {
  // Change to project root directory
  chdir(resolve(import.meta.dirname, ".."));

  console.log("Stopping Supabase...");
  // First stop might fail if project not running, that's okay
  spawnSync(
    "npx",
    ["supabase", "stop", "--project-id=UMassPhoto", "--no-backup"],
    {
      stdio: "inherit",
      shell: false,
    },
  );

  // Second stop might fail if nothing running, that's okay
  spawnSync("npx", ["supabase", "stop", "--all"], {
    stdio: "inherit",
    shell: false,
  });

  console.log(`\nGenerating migration: ${migrationName}...`);
  const diffResult = spawnSync(
    "npx",
    ["supabase", "db", "diff", "-f", migrationName],
    {
      stdio: "inherit",
      shell: false,
    },
  );
  if (diffResult.status !== 0) {
    throw new Error(
      `Failed to generate migration with status code: ${diffResult.status}`,
    );
  }

  console.log("\nStarting Supabase...");
  const startResult = spawnSync("npx", ["supabase", "start"], {
    stdio: "inherit",
    shell: false,
  });
  if (startResult.status !== 0) {
    throw new Error(
      `Failed to start Supabase with status code: ${startResult.status}`,
    );
  }

  console.log("\nGenerating TypeScript types...");
  const genTypesResult = spawnSync(
    "npx",
    ["supabase", "gen", "types", "typescript", "--local"],
    {
      stdio: ["inherit", "pipe", "inherit"],
      shell: false,
    },
  );
  if (genTypesResult.status !== 0) {
    throw new Error(
      `Failed to generate types with status code: ${genTypesResult.status}`,
    );
  }

  // Write types to file
  const typesPath = resolve(
    import.meta.dirname,
    "..",
    "..",
    "src/app/utils/supabase/database.types.ts",
  );
  writeFileSync(typesPath, genTypesResult.stdout);

  console.log("\nSupabase sync complete!");
}
