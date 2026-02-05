import {
  Database,
  Tables,
  TablesInsert,
} from "@/app/utils/supabase/database.types";
import { SupabaseClient } from "@supabase/supabase-js";

/**
 * Insert test users into the database.
 * @param client the Supabase client instance used to insert the users
 * @param testUsers the list of users to create
 * @returns a list of the users that were created
 */
export async function insertTestUsers(
  client: SupabaseClient<Database>,
  testUsers: readonly Readonly<TablesInsert<"photoclubuser">>[],
): Promise<Tables<"photoclubuser">[]> {
  const { data: existingUsers, error: listError } =
    await client.auth.admin.listUsers();
  if (listError) throw listError;

  const usersWithIds = [];
  for (const user of testUsers) {
    // If a user with this email already exists in auth, remove it first
    const existing = existingUsers.users.find(
      (existingUser) => existingUser.email === user.email,
    );
    if (existing) {
      const { error: deleteError } = await client.auth.admin.deleteUser(
        existing.id,
      );
      if (deleteError) throw deleteError;
    }

    // Use admin API to create user
    const { data, error } = await client.auth.admin.createUser({
      id: user.id,
      email: user.email,
      email_confirm: true,
      user_metadata: {},
    });
    if (error) throw error;

    // Update the user ID with the actual created ID
    usersWithIds.push({ ...user, id: data.user.id });
  }

  // Insert all users into photoclubuser table and return the created records
  return (
    await client
      .from("photoclubuser")
      .insert(usersWithIds)
      .select()
      .throwOnError()
  ).data;
}

/**
 * Delete test users from the database.
 * @param client the Supabase client instance used to delete the users
 * @param users the list of users to delete
 */
export async function deleteTestUsers(
  client: SupabaseClient<Database>,
  users: readonly Tables<"photoclubuser">[],
): Promise<void> {
  await client
    .from("photoclubuser")
    .delete()
    .in(
      "id",
      users.map((user) => user.id),
    )
    .throwOnError();

  for (const user of users) {
    const { error } = await client.auth.admin.deleteUser(user.id);
    if (error) throw error;
  }
}
