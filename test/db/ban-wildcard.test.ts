import dotenv from "dotenv";
import { beforeAll, describe, it, expect } from "vitest";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { Database, Tables } from "@/app/utils/supabase/database.types";
import { randomUUID } from "crypto";
import { insertTestUsers } from "./insertTestUsers";

dotenv.config();

describe("Ban System Wildcard Tests - public.is_banned()", () => {
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

  it("should support wildcard patterns in email ban", async () => {
    const wildcardEmailUser: Tables<"photoclubuser"> = {
      id: randomUUID(),
      email: "test@wildcard-test.com",
      username: "WildcardTest",
      role: "member",
      bio: null,
      profilepicture: null,
    };

    const wildcardEmailBanRecord: Tables<"ban"> = {
      id: randomUUID(),
      reason: "Test wildcard email ban",
      email: "%@wildcard-test.com",
      ip: null,
      username: null,
    };

    const { error: banError } = await supabase
      .from("ban")
      .insert(wildcardEmailBanRecord);

    if (banError) {
      throw new Error(
        `Failed to create wildcard email ban: ${JSON.stringify(banError)}`,
      );
    }

    const { error: wildcardUserError } = await insertTestUsers(supabase, [
      wildcardEmailUser,
    ]);

    if (wildcardUserError) {
      throw new Error(
        `Failed to create wildcard test user: ${JSON.stringify(wildcardUserError)}`,
      );
    }

    const { data, error } = await supabase.rpc("is_banned", {
      userid: wildcardEmailUser.id,
    });

    expect(error).toBeNull();
    expect(data).toBe(true);

    // Clean up
    await supabase.from("ban").delete().eq("id", wildcardEmailBanRecord.id);
    await supabase
      .from("photoclubuser")
      .delete()
      .eq("id", wildcardEmailUser.id);
    await supabase.auth.admin.deleteUser(wildcardEmailUser.id);
  });

  it("should support wildcard patterns in IP ban", async () => {
    const wildcardIpUser: Tables<"photoclubuser"> = {
      id: randomUUID(),
      email: "botnet@example.com",
      username: "IPTest",
      role: "member",
      bio: null,
      profilepicture: null,
    };

    const wildcardIpBanRecord: Tables<"ban"> = {
      id: randomUUID(),
      reason: "Test wildcard IP ban",
      email: null,
      ip: "172.16.%",
      username: null,
    };

    const wildcardIpRecord: Tables<"userip"> = {
      userid: wildcardIpUser.id,
      ipaddress: "172.16.0.5",
    };

    const { error: banError } = await supabase
      .from("ban")
      .insert(wildcardIpBanRecord);

    if (banError) {
      throw new Error(
        `Failed to create wildcard IP ban: ${JSON.stringify(banError)}`,
      );
    }

    const { error: wildcardIpUserError } = await insertTestUsers(supabase, [
      wildcardIpUser,
    ]);

    if (wildcardIpUserError) {
      throw new Error(
        `Failed to create wildcard IP test user: ${JSON.stringify(wildcardIpUserError)}`,
      );
    }

    const { error: userIpError } = await supabase
      .from("userip")
      .insert(wildcardIpRecord);

    if (userIpError) {
      throw new Error(
        `Failed to create wildcard IP record: ${JSON.stringify(userIpError)}`,
      );
    }

    const { data, error } = await supabase.rpc("is_banned", {
      userid: wildcardIpUser.id,
    });

    expect(error).toBeNull();
    expect(data).toBe(true);

    // Clean up
    await supabase
      .from("userip")
      .delete()
      .eq("userid", wildcardIpUser.id)
      .eq("ipaddress", wildcardIpRecord.ipaddress);
    await supabase.from("ban").delete().eq("id", wildcardIpBanRecord.id);
    await supabase.from("photoclubuser").delete().eq("id", wildcardIpUser.id);
    await supabase.auth.admin.deleteUser(wildcardIpUser.id);
  });

  it("should support wildcard patterns in username ban", async () => {
    const wildcardUsernameUser: Tables<"photoclubuser"> = {
      id: randomUUID(),
      email: "banned-wildcard-username@example.com",
      username: "SpamBot123",
      role: "member",
      bio: null,
      profilepicture: null,
    };

    const wildcardUsernameBanRecord: Tables<"ban"> = {
      id: randomUUID(),
      reason: "Test wildcard username ban",
      email: null,
      ip: null,
      username: "Spam%",
    };

    const { error: banError } = await supabase
      .from("ban")
      .insert(wildcardUsernameBanRecord);

    if (banError) {
      throw new Error(
        `Failed to create wildcard username ban: ${JSON.stringify(banError)}`,
      );
    }

    const { error: wildcardUsernameUserError } = await insertTestUsers(
      supabase,
      [wildcardUsernameUser],
    );

    if (wildcardUsernameUserError) {
      throw new Error(
        `Failed to create wildcard username test user: ${JSON.stringify(wildcardUsernameUserError)}`,
      );
    }

    const { data, error } = await supabase.rpc("is_banned", {
      userid: wildcardUsernameUser.id,
    });

    expect(error).toBeNull();
    expect(data).toBe(true);

    // Clean up
    await supabase.from("ban").delete().eq("id", wildcardUsernameBanRecord.id);
    await supabase
      .from("photoclubuser")
      .delete()
      .eq("id", wildcardUsernameUser.id);
    await supabase.auth.admin.deleteUser(wildcardUsernameUser.id);
  });
});
