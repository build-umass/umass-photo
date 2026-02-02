import {
  Database,
  Tables,
  TablesInsert,
} from "@/app/utils/supabase/database.types";
import { SupabaseClient } from "@supabase/supabase-js";

type CreateTestUsersResult =
  | {
      data: Tables<"photoclubuser">[];
      error: null;
    }
  | {
      data: null;
      error: object;
    };

/**
 * Insert test users into the database.
 * @param client the Supabase client instance used to insert the users
 * @param testUsers the list of users to create
 * @returns a result object containing either the created users or an error
 */
export async function insertTestUsers(
  client: SupabaseClient<Database>,
  testUsers: TablesInsert<"photoclubuser">[],
): Promise<CreateTestUsersResult> {
  for (const user of testUsers) {
    // If a user with this email already exists in auth, remove it first
    const { data: existingUsers, error: listError } =
      await client.auth.admin.listUsers();
    if (listError) {
      return {
        data: null,
        error: { message: "Failed to list users", error: listError },
      };
    } else {
      const existing = existingUsers?.users?.find(
        (u) => u.email === user.email,
      );
      if (existing) {
        const { error: deleteError } = await client.auth.admin.deleteUser(
          existing.id,
        );
        if (deleteError) {
          return {
            data: null,
            error: {
              message: "Failed to delete existing user",
              error: deleteError,
            },
          };
        }
      }
    }

    // Use admin API to create user (service role key required)
    const { data, error } = await client.auth.admin.createUser({
      id: user.id,
      email: user.email,
      email_confirm: true,
      user_metadata: {},
    });

    if (error) {
      return { data: null, error: { message: "Failed to create user", error } };
    }

    // Update the user ID with the actual created ID
    if (data?.user?.id) {
      user.id = data.user.id;
    }
  }

  // Insert all users into photoclubuser table and return the created records
  const createdUsers: Tables<"photoclubuser">[] = [];
  for (const user of testUsers) {
    const { data, error: userError } = await client
      .from("photoclubuser")
      .insert([
        {
          id: user.id,
          username: user.username,
          email: user.email,
          bio: "hi",
          role: user.role,
        },
      ])
      .select()
      .single();
    if (userError) {
      return {
        data: null,
        error: {
          message: "Failed to insert user into photoclubuser table",
          error: userError,
        },
      };
    }
    if (data) {
      createdUsers.push(data);
    }
  }

  return { data: createdUsers, error: null };
}
