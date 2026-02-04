import { createClient } from "@supabase/supabase-js";
import type {
  Database,
  Tables,
  TablesInsert,
} from "../../src/app/utils/supabase/database.types.ts";
import { config } from "dotenv";
import { SupabaseClient } from "@supabase/supabase-js";
import { randomUUID } from "crypto";
import * as fs from "fs/promises";
import * as path from "path";
config();

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
  const { data: testUsers, error: createUsersError } = await insertTestUsers(
    client,
    [
      {
        email: "amoinus@gmail.com",
        username: "max 1",
        role: "admin",
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
    return {
      data: null,
      error: {
        message: "Failed to create test users",
        error: createUsersError,
      },
    };
  }

  await Promise.all(
    [...Array(9).keys()].map(async (i) => {
      const fileName = `${(i + 1).toString().padStart(2, "0")}.png`;
      const file = await fs.readFile(
        path.resolve(
          import.meta.dirname,
          "..",
          "..",
          "test",
          "db",
          "photos",
          fileName,
        ),
      );
      await client.storage.from("photos").upload(fileName, file);
    }),
  );

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
    return {
      data: null,
      error: { message: "Failed to insert photos", error: photosError },
    };
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
    return {
      data: null,
      error: { message: "Failed to insert tags", error: tagsError },
    };
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
    return {
      data: null,
      error: { message: "Failed to insert phototags", error: phototagsError },
    };
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
    return {
      data: null,
      error: { message: "Failed to insert events", error: eventsError },
    };
  }

  const { error: blogsError } = await client.from("blog").insert([
    {
      id: randomUUID(),
      authorid: "43188856-13db-410a-b1a2-b006056cd84f",
      content:
        "We're excited to announce the launch of our new blog! Here we'll share photography tips, event highlights, and member spotlights.\n\n## What to Expect\n\n- **Weekly Tips**: Improve your photography skills with expert advice\n- **Event Recaps**: See the best shots from our photo walks and workshops\n- **Member Features**: Get to know your fellow photographers\n\nStay tuned for more updates!",
      postdate: "2024-01-15 10:00:00",
      title: "Welcome to UMass Photo Club",
    },
    {
      id: randomUUID(),
      authorid: "beebdcae-ba00-4c16-9e1c-2103381337bf",
      content:
        "![Camera Settings](https://images.unsplash.com/photo-1606986628834-bc8b7a95a6d2?w=800)\n\nThe exposure triangle consists of three key elements that determine your photo's exposure:\n\n## 1. Aperture (f-stop)\nControls depth of field and how much light enters the lens.\n\n## 2. Shutter Speed\nDetermines motion blur and exposure time.\n\n## 3. ISO\nAffects sensor sensitivity and image noise.\n\n**Pro tip**: Master one element at a time before combining them!",
      postdate: "2024-02-20 14:30:00",
      title: "Understanding Exposure Triangle",
    },
    {
      id: randomUUID(),
      authorid: "43188856-13db-410a-b1a2-b006056cd84f",
      content:
        "What an amazing turnout for our Spring Photo Walk! Over 30 members joined us to capture the beautiful spring blooms around campus.\n\n## Best Shots\n\n1. Cherry blossoms at the pond\n2. Macro shots of tulips\n3. Wide landscapes of the campus green\n\nThank you to everyone who participated. Check out the gallery for all submitted photos!\n\n*Next walk: May 15th - Golden Hour Session*",
      postdate: "2024-04-18 16:45:00",
      title: "Spring Photo Walk Highlights",
    },
    {
      id: randomUUID(),
      authorid: "beebdcae-ba00-4c16-9e1c-2103381337bf",
      content:
        "🌙 Ready to shoot the stars? Here are my top tips:\n\n1. **Use a tripod** - Essential for long exposures\n2. **Manual focus** - Autofocus struggles in low light\n3. **Wide aperture** - f/2.8 or wider is ideal\n4. **High ISO** - Start at 3200 and adjust\n5. **Long exposure** - 15-30 seconds for stars\n\n## Bonus Tip\nUse the 500 rule to avoid star trails: 500 ÷ focal length = max shutter speed\n\nJoin us at the Night Sky Workshop to practice these techniques!",
      postdate: "2024-09-10 12:00:00",
      title: "5 Tips for Night Photography",
    },
  ]);
  if (blogsError) {
    return {
      data: null,
      error: { message: "Failed to insert blogs", error: blogsError },
    };
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

export async function generateTestData() {
  const apiUrl = process.env.API_URL || process.env.SUPABASE_URL;
  const supabaseServiceKey =
    process.env.SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!apiUrl) throw new Error("Supabase URL not found in environment!");
  if (!supabaseServiceKey)
    throw new Error("Supabase service role key not found in environment!");

  const supabase = createClient<Database>(apiUrl, supabaseServiceKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
    db: {
      schema: "public",
    },
  });

  await insertTestData(supabase);
}
