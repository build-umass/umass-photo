import dotenv from "dotenv";
import { beforeAll, describe, it, expect } from "vitest";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { Database, TablesInsert } from "@/app/utils/supabase/database.types";
import { randomUUID } from "crypto";
import { deleteTestUsers, insertTestUsers } from "./insertTestUsers";

dotenv.config();

type TestCaseDescription = Readonly<{
  user: TablesInsert<"photoclubuser">;
  ban: TablesInsert<"ban">;
  userIps: TablesInsert<"userip">[];
  expected: boolean;
  description: string;
}>;

/** Common uuid for test cases that require correlated uuids */
const constUUID = randomUUID();
const testCases: readonly TestCaseDescription[] = [
  {
    description: "should return true for user banned by email",
    user: {
      id: randomUUID(),
      email: "banned-by-email@example.com",
      username: "TestUser1",
      role: "member",
    },
    ban: {
      reason: "Test ban by email",
      email: "banned-by-email@example.com",
    },
    userIps: [],
    expected: true,
  },
  {
    description: "should return true for user banned by ip",
    user: {
      id: constUUID,
      email: "banned-by-email@example.com",
      username: "TestUser1",
      role: "member",
    },
    ban: {
      reason: "Test ban by ip",
      ip: "192.168.1.1",
    },
    userIps: [
      {
        userid: constUUID,
        ipaddress: "192.168.1.1",
      },
    ],
    expected: true,
  },
  {
    description: "should return true for user banned by username",
    user: {
      id: randomUUID(),
      email: "banned-by-username@example.com",
      username: "TestUser1",
      role: "member",
    },
    ban: {
      reason: "Test ban by username",
      username: "TestUser1",
    },
    userIps: [],
    expected: true,
  },
  {
    description: "should return true for user banned by email (regex)",
    user: {
      id: randomUUID(),
      email: "banned-by-email@example.com",
      username: "TestUser1",
      role: "member",
    },
    ban: {
      reason: "Test ban by email",
      email: "banned-by-email%",
    },
    userIps: [],
    expected: true,
  },
  {
    description: "should return true for user banned by ip (regex)",
    user: {
      id: constUUID,
      email: "banned-by-email@example.com",
      username: "TestUser1",
      role: "member",
    },
    ban: {
      reason: "Test ban by ip",
      ip: "192.168.%",
    },
    userIps: [
      {
        userid: constUUID,
        ipaddress: "192.168.1.1",
      },
    ],
    expected: true,
  },
  {
    description: "should return true for user banned by username (regex)",
    user: {
      id: randomUUID(),
      email: "banned-by-username@example.com",
      username: "TestUser1",
      role: "member",
    },
    ban: {
      reason: "Test ban by username",
      username: "Test%",
    },
    userIps: [],
    expected: true,
  },
  {
    description: "should return false for incomplete match",
    user: {
      id: randomUUID(),
      email: "cleanuser@example.com",
      username: "TestUser1",
      role: "member",
    },
    ban: {
      reason: "Test multiple bans",
      username: "Nonmatching%",
      email: "%@example.com",
    },
    userIps: [],
    expected: false,
  },
  {
    description: "should return true for multiple matches",
    user: {
      id: randomUUID(),
      email: "cleanuser@example.com",
      username: "TestUser1",
      role: "member",
    },
    ban: {
      reason: "Test multiple bans",
      username: "TestUser1",
      email: "%@example.com",
    },
    userIps: [],
    expected: true,
  },
];

describe("public.ban_affects_user()", () => {
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

  testCases.forEach(
    ({
      user: userInsert,
      ban,
      userIps: userIpsInsert,
      expected,
      description,
    }) => {
      it(description, async () => {
        // Set up test data
        const [user] = await insertTestUsers(supabase, [userInsert]);
        const { data: userIps } = await supabase
          .from("userip")
          .insert(userIpsInsert)
          .select()
          .throwOnError();

        // Run the test
        const { data } = await supabase
          .rpc("ban_affects_user", {
            ban: {
              id: randomUUID(),
              email: null,
              ip: null,
              username: null,
              ...ban,
            },
            photoclubuser: user,
          })
          .throwOnError();
        expect(data).toBe(expected);

        // Clean up test data
        for (const userIp of userIps) {
          await supabase
            .from("userip")
            .delete()
            .eq("userid", userIp.userid)
            .eq("ipaddress", userIp.ipaddress)
            .throwOnError();
        }
        await deleteTestUsers(supabase, [user]);
      });
    },
  );
});

describe("public.is_banned()", () => {
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

  testCases.forEach(
    ({
      user: userInsert,
      ban: banInsert,
      userIps: userIpsInsert,
      expected,
      description,
    }) => {
      it(description, async () => {
        // Set up test data
        const [user] = await insertTestUsers(supabase, [userInsert]);

        const { data: userIps } = await supabase
          .from("userip")
          .insert(userIpsInsert)
          .select()
          .throwOnError();

        const { data: ban } = await supabase
          .from("ban")
          .insert([banInsert])
          .select()
          .single()
          .throwOnError();

        // Run the test
        const { data } = await supabase
          .rpc("is_banned", {
            photoclubuser: user,
          })
          .throwOnError();
        expect(data).toBe(expected);

        // Clean up test data
        await supabase.from("ban").delete().eq("id", ban.id);
        await deleteTestUsers(supabase, [user]);
        for (const userIp of userIps) {
          await supabase
            .from("userip")
            .delete()
            .eq("userid", userIp.userid)
            .eq("ipaddress", userIp.ipaddress)
            .throwOnError();
        }
      });
    },
  );
});

describe("public.ban_affects_users()", () => {
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

  testCases.forEach(
    ({
      user: userInsert,
      ban,
      userIps: userIpsInsert,
      expected,
      description,
    }) => {
      it(description, async () => {
        // Set up test data
        const [user] = await insertTestUsers(supabase, [userInsert]);

        const { data: userIps } = await supabase
          .from("userip")
          .insert(userIpsInsert)
          .select()
          .throwOnError();

        // Run the test
        const { data } = await supabase
          .rpc("ban_affects_users", {
            ban: {
              id: randomUUID(),
              email: null,
              ip: null,
              username: null,
              ...ban,
            },
          })
          .throwOnError();
        expect(data.map((datum) => datum.id)).toEqual(
          expected ? [user.id] : [],
        );

        // Clean up test data
        await deleteTestUsers(supabase, [user]);
        for (const userIp of userIps) {
          await supabase
            .from("userip")
            .delete()
            .eq("userid", userIp.userid)
            .eq("ipaddress", userIp.ipaddress)
            .throwOnError();
        }
      });
    },
  );
});
