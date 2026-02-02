import dotenv from "dotenv";
import { beforeAll, describe, it, expect } from "vitest";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { Database, Tables } from "@/app/utils/supabase/database.types";
import { randomUUID } from "crypto";
import { insertTestUsers } from "./insertTestUsers";

dotenv.config();

describe("Ban System Tests - public.is_banned()", () => {
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

  it("should return true for user banned by email", async () => {
    const userBannedByEmail: Tables<"photoclubuser"> = {
      id: randomUUID(),
      email: "banned-by-email@example.com",
      username: "TestUser1",
      role: "member",
      profilepicture: null,
      bio: null,
    };

    const { error: userError } = await insertTestUsers(supabase, [
      userBannedByEmail,
    ]);
    if (userError) throw new Error(`Error inserting test users: ${userError}`);

    const banId = randomUUID();
    const banReason = "Test ban by email";

    const { error: banError } = await supabase.from("ban").insert([
      {
        id: banId,
        reason: banReason,
        email: userBannedByEmail.email,
        ip: null,
        username: null,
      },
    ]);
    if (banError) throw new Error(`Error inserting ban records: ${banError}`);

    const { data, error } = await supabase.rpc("is_banned", {
      userid: userBannedByEmail.id,
    });

    expect(error).toBeNull();
    expect(data).toBe(true);

    await supabase.from("ban").delete().eq("id", banId);
    await supabase
      .from("photoclubuser")
      .delete()
      .eq("id", userBannedByEmail.id);
    await supabase.auth.admin.deleteUser(userBannedByEmail.id);
  });

  it("should return true for user banned by username", async () => {
    const userBannedByUsername: Tables<"photoclubuser"> = {
      id: randomUUID(),
      email: "banned-by-username@example.com",
      username: "BannedUsername",
      role: "member",
      profilepicture: null,
      bio: null,
    };

    const { error: userError } = await insertTestUsers(supabase, [
      userBannedByUsername,
    ]);
    if (userError) throw new Error(`Error inserting test users: ${userError}`);

    const banId = randomUUID();
    const banReason = "Test ban by username";

    const { error: banError } = await supabase.from("ban").insert([
      {
        id: banId,
        reason: banReason,
        email: null,
        ip: null,
        username: userBannedByUsername.username,
      },
    ]);
    if (banError) throw new Error(`Error inserting ban records: ${banError}`);

    const { data, error } = await supabase.rpc("is_banned", {
      userid: userBannedByUsername.id,
    });

    expect(error).toBeNull();
    expect(data).toBe(true);

    await supabase.from("ban").delete().eq("id", banId);
    await supabase
      .from("photoclubuser")
      .delete()
      .eq("id", userBannedByUsername.id);
    await supabase.auth.admin.deleteUser(userBannedByUsername.id);
  });

  it("should return true for user banned by IP address", async () => {
    const userBannedByIp: Tables<"photoclubuser"> = {
      id: randomUUID(),
      email: "banned-by-ip@example.com",
      username: "TestUser3",
      role: "member",
      profilepicture: null,
      bio: null,
    };

    const { error: userError } = await insertTestUsers(supabase, [
      userBannedByIp,
    ]);
    if (userError) throw new Error(`Error inserting test users: ${userError}`);

    const { error: userIpError } = await supabase.from("userip").insert([
      {
        userid: userBannedByIp.id,
        ipaddress: "10.0.0.50",
      },
    ]);
    if (userIpError)
      throw new Error(`Error inserting user IP records: ${userIpError}`);

    const banId = randomUUID();
    const banReason = "Test ban by IP";

    const { error: banError } = await supabase.from("ban").insert([
      {
        id: banId,
        reason: banReason,
        email: null,
        ip: "10.0.0.50",
        username: null,
      },
    ]);
    if (banError) throw new Error(`Error inserting ban records: ${banError}`);

    const { data, error } = await supabase.rpc("is_banned", {
      userid: userBannedByIp.id,
    });

    expect(error).toBeNull();
    expect(data).toBe(true);

    await supabase
      .from("userip")
      .delete()
      .eq("userid", userBannedByIp.id)
      .eq("ipaddress", "10.0.0.50");
    await supabase.from("ban").delete().eq("id", banId);
    await supabase.from("photoclubuser").delete().eq("id", userBannedByIp.id);
    await supabase.auth.admin.deleteUser(userBannedByIp.id);
  });

  it("should return false for user who is not banned", async () => {
    const cleanUser: Tables<"photoclubuser"> = {
      id: randomUUID(),
      email: "not-banned@example.com",
      username: "CleanUser",
      role: "member",
      profilepicture: null,
      bio: null,
    };

    const { error: userError } = await insertTestUsers(supabase, [cleanUser]);
    if (userError) throw new Error(`Error inserting test users: ${userError}`);

    const { error: userIpError } = await supabase.from("userip").insert([
      {
        userid: cleanUser.id,
        ipaddress: "192.168.1.200",
      },
    ]);
    if (userIpError)
      throw new Error(`Error inserting user IP records: ${userIpError}`);

    const { data, error } = await supabase.rpc("is_banned", {
      userid: cleanUser.id,
    });

    expect(error).toBeNull();
    expect(data).toBe(false);

    await supabase
      .from("userip")
      .delete()
      .eq("userid", cleanUser.id)
      .eq("ipaddress", "192.168.1.200");
    await supabase.from("photoclubuser").delete().eq("id", cleanUser.id);
    await supabase.auth.admin.deleteUser(cleanUser.id);
  });

  it("should handle non-existent user ID gracefully", async () => {
    const nonExistentId = randomUUID();
    const { data, error } = await supabase.rpc("is_banned", {
      userid: nonExistentId,
    });

    expect(error).toBeNull();
    expect(data).toBe(false);
  });
});
