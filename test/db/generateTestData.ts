import {
  Database,
  Tables,
  TablesInsert,
} from "@/app/utils/supabase/database.types";
import { SupabaseClient } from "@supabase/supabase-js";

type SeedDataResult =
  | {
      data: Tables<"photoclubuser">[];
      error: null;
    }
  | {
      data: null;
      error: object;
    };

/**
 * Insert fake data into the database for testing.
 * @param client The Supabase client to use for the inserts.
 * @returns a result object containing either the created users or an error
 */
export async function insertTestData(
  client: SupabaseClient<Database>,
): Promise<SeedDataResult> {
  const { error: rolesError } = await client.from("photoclubrole").insert([
    { roleid: "admin", is_admin: true },
    { roleid: "member", is_admin: false },
    { roleid: "eboard", is_admin: true },
  ]);
  if (rolesError) {
    return { data: null, error: rolesError };
  }

  const { data: testUsers, error: createUsersError } = await insertTestUsers(
    client,
    [
      {
        email: "amoinus@gmail.com",
        username: "max 1",
        role: "eboard",
        id: "43188856-13db-410a-b1a2-b006056cd84f",
      },
      {
        email: "maxwelltang@umass.edu",
        username: "max 2",
        role: "member",
        id: "beebdcae-ba00-4c16-9e1c-2103381337bf",
      },
    ],
  );
  if (createUsersError) {
    return { data: null, error: createUsersError };
  }

  const { error: photosError } = await client.from("photo").insert([
    {
      id: 1,
      title: "title 1",
      authorid: "43188856-13db-410a-b1a2-b006056cd84f",
      description: "description 1",
      file: "01.png",
      postdate: "2020-03-15 14:30:00",
    },
    {
      id: 2,
      title: "title 2",
      authorid: "beebdcae-ba00-4c16-9e1c-2103381337bf",
      description: "description 2",
      file: "02.png",
      postdate: "2020-07-22 16:45:00",
    },
    {
      id: 3,
      title: "title 3",
      authorid: "43188856-13db-410a-b1a2-b006056cd84f",
      description: "description 3",
      file: "03.png",
      postdate: "2021-01-10 09:15:00",
    },
    {
      id: 4,
      title: "title 4",
      authorid: "beebdcae-ba00-4c16-9e1c-2103381337bf",
      description: "description 4",
      file: "04.png",
      postdate: "2021-05-18 12:20:00",
    },
    {
      id: 5,
      title: "title 5",
      authorid: "43188856-13db-410a-b1a2-b006056cd84f",
      description: "description 5",
      file: "05.png",
      postdate: "2022-02-28 18:00:00",
    },
    {
      id: 6,
      title: "title 6",
      authorid: "beebdcae-ba00-4c16-9e1c-2103381337bf",
      description: "description 6",
      file: "06.png",
      postdate: "2022-08-14 11:30:00",
    },
    {
      id: 7,
      title: "title 7",
      authorid: "43188856-13db-410a-b1a2-b006056cd84f",
      description: "description 7",
      file: "07.png",
      postdate: "2023-04-03 15:45:00",
    },
    {
      id: 8,
      title: "title 8",
      authorid: "beebdcae-ba00-4c16-9e1c-2103381337bf",
      description: "description 8",
      file: "08.png",
      postdate: "2023-11-12 13:10:00",
    },
    {
      id: 9,
      title: "title 9",
      authorid: "43188856-13db-410a-b1a2-b006056cd84f",
      description: "description 9",
      file: "09.png",
      postdate: "2024-06-25 17:30:00",
    },
  ]);
  if (photosError) {
    return { data: null, error: photosError };
  }

  const { error: tagsError } = await client
    .from("tag")
    .insert([
      { name: "nature" },
      { name: "water" },
      { name: "sky" },
      { name: "people" },
      { name: "Summer Contest" },
    ]);
  if (tagsError) {
    return { data: null, error: tagsError };
  }

  const { error: phototagsError } = await client.from("phototag").insert([
    { photoid: 1, tag: "nature" },
    { photoid: 1, tag: "sky" },
    { photoid: 2, tag: "people" },
    { photoid: 3, tag: "nature" },
    { photoid: 3, tag: "sky" },
    { photoid: 3, tag: "Summer Contest" },
    { photoid: 5, tag: "nature" },
    { photoid: 5, tag: "Summer Contest" },
    { photoid: 7, tag: "people" },
    { photoid: 8, tag: "nature" },
    { photoid: 9, tag: "sky" },
  ]);
  if (phototagsError) {
    return { data: null, error: phototagsError };
  }

  const { error: eventsError } = await client.from("event").insert([
    {
      id: 1,
      name: "Spring Photo Walk",
      startdate: "2025-04-12 09:00:00",
      enddate: "2025-04-12 17:00:00",
      tag: "nature",
      description: "A community walk to photograph spring blooms.",
      herofile: "01.png",
    },
    {
      id: 2,
      name: "Summer Contest",
      startdate: "2025-07-01 00:00:00",
      enddate: "2025-07-31 23:59:59",
      tag: "Summer Contest",
      description: "Monthly summer photo contest; open to all members.",
      herofile: "05.png",
    },
    {
      id: 3,
      name: "Night Sky Workshop",
      startdate: "2025-09-15 20:00:00",
      enddate: "2025-09-15 23:30:00",
      tag: "sky",
      description: "Learn long exposure techniques for astrophotography.",
      herofile: "09.png",
    },
    {
      id: 4,
      name: "Waterfall Hike",
      startdate: "2025-05-20 08:00:00",
      enddate: "2025-05-20 14:00:00",
      tag: "water",
      description: "Day trip to nearby waterfall for landscape shots.",
      herofile: "02.png",
    },
    {
      id: 5,
      name: "Portrait Session",
      startdate: "2025-11-08 18:00:00",
      enddate: "2025-11-08 20:00:00",
      tag: "people",
      description: "Portrait lighting and posing session.",
      herofile: "07.png",
    },
  ]);
  if (eventsError) {
    return { data: null, error: eventsError };
  }

  return {
    data: testUsers,
    error: null,
  };
}

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
async function insertTestUsers(
  client: SupabaseClient<Database>,
  testUsers: TablesInsert<"photoclubuser">[],
): Promise<CreateTestUsersResult> {
  for (const user of testUsers) {
    // If a user with this email already exists in auth, remove it first
    const { data: existingUsers, error: listError } =
      await client.auth.admin.listUsers();
    if (listError) {
      return { data: null, error: listError };
    } else {
      const existing = existingUsers?.users?.find(
        (u) => u.email === user.email,
      );
      if (existing) {
        const { error: deleteError } = await client.auth.admin.deleteUser(
          existing.id,
        );
        if (deleteError) {
          return { data: null, error: deleteError };
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
      return { data: null, error };
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
      return { data: null, error: userError };
    }
    if (data) {
      createdUsers.push(data);
    }
  }

  return { data: createdUsers, error: null };
}
