import { Database, Tables, TablesInsert } from '@/app/utils/supabase/database.types';
import { SupabaseClient } from '@supabase/supabase-js';

interface SeedDataResult {
  users: Tables<"photoclubuser">[];
  error?: string;
}

/**
 * Creates fake users and seeds the database with test data
 * Users are created directly in auth.users and auth.identities tables
 * Replicates the behavior of insert_data.sql
 * @param client - Supabase client instance to use for database operations
 */
export async function seedTestData(client: SupabaseClient<Database>): Promise<SeedDataResult> {
  // Insert roles
  const { error: rolesError } = await client.from('photoclubrole').insert([
    { roleid: 'admin', is_admin: true },
    { roleid: 'member', is_admin: false },
    { roleid: 'eboard', is_admin: true },
  ]);
  if (rolesError) {
    console.error('Error inserting roles:', rolesError);
    return { users: [], error: rolesError.message };
  }

  // Insert users
  const testUsersData: TablesInsert<"photoclubuser">[] = [
    {
      email: 'amoinus@gmail.com',
      username: 'max 1',
      role: 'eboard',
      id: '43188856-13db-410a-b1a2-b006056cd84f',
    },
    {
      email: 'maxwelltang@umass.edu',
      username: 'max 2',
      role: 'member',
      id: 'beebdcae-ba00-4c16-9e1c-2103381337bf',
    },
  ];
  const { data: testUsers, error: createUsersError } = await createTestUsers(client, testUsersData);
  if (createUsersError || !testUsers) {
    console.error('Error creating test users:', createUsersError);
    return { users: [], error: createUsersError || 'Failed to create test users' };
  }

  // Insert photos
  const { error: photosError } = await client.from('photo').insert([
    { id: 1, title: 'title 1', authorid: testUsers[0].id, description: 'description 1', file: '01.png', postdate: '2020-03-15 14:30:00' },
    { id: 2, title: 'title 2', authorid: testUsers[1].id, description: 'description 2', file: '02.png', postdate: '2020-07-22 16:45:00' },
    { id: 3, title: 'title 3', authorid: testUsers[0].id, description: 'description 3', file: '03.png', postdate: '2021-01-10 09:15:00' },
    { id: 4, title: 'title 4', authorid: testUsers[1].id, description: 'description 4', file: '04.png', postdate: '2021-05-18 12:20:00' },
    { id: 5, title: 'title 5', authorid: testUsers[0].id, description: 'description 5', file: '05.png', postdate: '2022-02-28 18:00:00' },
    { id: 6, title: 'title 6', authorid: testUsers[1].id, description: 'description 6', file: '06.png', postdate: '2022-08-14 11:30:00' },
    { id: 7, title: 'title 7', authorid: testUsers[0].id, description: 'description 7', file: '07.png', postdate: '2023-04-03 15:45:00' },
    { id: 8, title: 'title 8', authorid: testUsers[1].id, description: 'description 8', file: '08.png', postdate: '2023-11-12 13:10:00' },
    { id: 9, title: 'title 9', authorid: testUsers[0].id, description: 'description 9', file: '09.png', postdate: '2024-06-25 17:30:00' },
  ]);
  if (photosError) {
    console.error('Failed inserting photos:', photosError);
    return { users: [], error: photosError.message };
  }

  // Insert tags
  const { error: tagsError } = await client.from('tag').insert([
    { name: 'nature' },
    { name: 'water' },
    { name: 'sky' },
    { name: 'people' },
    { name: 'Summer Contest' },
  ]);
  if (tagsError) {
    console.error('Failed inserting tags:', tagsError);
    return { users: [], error: tagsError.message };
  }

  // Insert photo tags
  const { error: phototagsError } = await client.from('phototag').insert([
    { photoid: 1, tag: 'nature' },
    { photoid: 1, tag: 'sky' },
    { photoid: 2, tag: 'people' },
    { photoid: 3, tag: 'nature' },
    { photoid: 3, tag: 'sky' },
    { photoid: 3, tag: 'Summer Contest' },
    { photoid: 5, tag: 'nature' },
    { photoid: 5, tag: 'Summer Contest' },
    { photoid: 7, tag: 'people' },
    { photoid: 8, tag: 'nature' },
    { photoid: 9, tag: 'sky' },
  ]);
  if (phototagsError) {
    console.error('Failed inserting phototags:', phototagsError);
    return { users: [], error: phototagsError.message };
  }

  // Insert events
  const { error: eventsError } = await client.from('event').insert([
    { id: 1, name: 'Spring Photo Walk', startdate: '2025-04-12 09:00:00', enddate: '2025-04-12 17:00:00', tag: 'nature', description: 'A community walk to photograph spring blooms.', herofile: '01.png' },
    { id: 2, name: 'Summer Contest', startdate: '2025-07-01 00:00:00', enddate: '2025-07-31 23:59:59', tag: 'Summer Contest', description: 'Monthly summer photo contest; open to all members.', herofile: '05.png' },
    { id: 3, name: 'Night Sky Workshop', startdate: '2025-09-15 20:00:00', enddate: '2025-09-15 23:30:00', tag: 'sky', description: 'Learn long exposure techniques for astrophotography.', herofile: '09.png' },
    { id: 4, name: 'Waterfall Hike', startdate: '2025-05-20 08:00:00', enddate: '2025-05-20 14:00:00', tag: 'water', description: 'Day trip to nearby waterfall for landscape shots.', herofile: '02.png' },
    { id: 5, name: 'Portrait Session', startdate: '2025-11-08 18:00:00', enddate: '2025-11-08 20:00:00', tag: 'people', description: 'Portrait lighting and posing session.', herofile: '07.png' },
  ]);
  if (eventsError) {
    console.error('Failed inserting events:', eventsError);
    return { users: [], error: eventsError.message };
  }

  // no connection to close for supabase client

  return {
    users: testUsers,
  };
}

interface CreateTestUsersResult {
  data?: Tables<"photoclubuser">[];
  error?: string;
}

/**
 * Creates test users using Supabase Admin Auth API
 * Returns an array of created users with their IDs
 * @param client - Supabase client instance
 * @param testUsers - Array of test user data to create
 */
async function createTestUsers(
  client: SupabaseClient<Database>,
  testUsers: TablesInsert<"photoclubuser">[]
): Promise<CreateTestUsersResult> {

  for (const user of testUsers) {
    // If a user with this email already exists in auth, remove it first
    const { data: existingUsers, error: listError } = await client.auth.admin.listUsers();
    if (listError) {
      console.error(`Error checking for existing user ${user.email}:`, listError);
      return { error: `Failed to list users: ${listError.message}` };
    } else {
      const existing = existingUsers?.users?.find(u => u.email === user.email);
      if (existing) {
        const { error: deleteError } = await client.auth.admin.deleteUser(existing.id);
        if (deleteError) {
          console.error(`Error deleting existing user ${user.email}:`, deleteError);
          return { error: `Failed to delete existing user ${user.email}: ${deleteError.message}` };
        } else {
          console.log(`Removed existing auth user for email ${user.email} with id ${existing.id}`);
        }
      }
    }

    console.log(`Creating test user: ${user.email} with ID: ${user.id}`);

    // Use admin API to create user (service role key required)
    const { data, error } = await client.auth.admin.createUser({
      id: user.id,
      email: user.email,
      email_confirm: true,
      user_metadata: {},
    });

    if (error) {
      console.error('Error creating test user via supabase admin:', error);
      return { error: `Failed to create test user: ${error.message}` };
    }

    // Update the user ID with the actual created ID
    if (data?.user?.id) {
      user.id = data.user.id;
    }

    console.log(`Created test user: ${user.email} with ID: ${user.id}`);
  }

  // Insert all users into photoclubuser table and return the created records
  const createdUsers: Tables<"photoclubuser">[] = [];
  for (const user of testUsers) {
    console.log(`Inserting photoclubuser: ${user.email}`);
    const { data, error: userError } = await client.from('photoclubuser').insert([
      { id: user.id, username: user.username, email: user.email, bio: 'hi', role: user.role }
    ]).select().single();
    if (userError) {
      console.error(`Failed inserting photoclubuser ${user.email}:`, userError);
      return { error: `Failed to insert photoclubuser ${user.email}: ${userError.message}` };
    }
    if (data) {
      createdUsers.push(data);
    }
  }

  return { data: createdUsers };
}
