import { parseArgs } from "node:util";
import { generateTestData } from "./lib/generateTestData.ts";

const {
  values: { help },
} = parseArgs({
  args: process.argv.slice(2),
  options: {
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
Usage: node scripts/generateTestData.ts

Insert test data into the Supabase database.

Options:
  -h, --help             Show this help message
`.trim(),
  );
  process.exit(0);
}

try {
  await generateTestData();
} catch (error) {
  console.error("Data generation failed:", error);
  process.exit(1);
}
