import { Database } from '@/app/utils/supabase/database.types';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

interface TestUser {
  id: string;
  email: string;
  password: string;
  username: string;
  role: string;
}

interface SeedDataResult {
  users: TestUser[];
  error?: string;
}

/**
 * Creates fake users and seeds the database with test data
 * Users are created directly in auth.users and auth.identities tables
 * Replicates the behavior of insert_data.sql
 */
export async function seedTestData(): Promise<SeedDataResult> {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_API_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Supabase URL or service key not found in environment!');
  }

  const sql = createClient<Database>(supabaseUrl, supabaseServiceKey, { auth: { persistSession: false } });
  try {
    // Create test users directly in auth tables
    const testUsers = await createTestUsers(sql);

    // Insert roles
    try {
      await sql.from('photoclubrole').insert([
        { roleid: 'admin', is_admin: true },
        { roleid: 'member', is_admin: false },
        { roleid: 'eboard', is_admin: true },
      ]);
    } catch (err) {
      // ignore duplicate errors
      console.warn('Warning inserting roles:', err);
    }

    // Insert users into photoclubuser table
    for (const user of testUsers) {
      try {
        console.log(`Inserting photoclubuser: ${user.email}`);
        await sql.from('photoclubuser').insert([
          { id: user.id, username: user.username, email: user.email, bio: 'hi', role: user.role }
        ]);
      } catch (err) {
        console.warn(`Failed inserting photoclubuser ${user.email}:`, err);
      }
    }

    // Insert photos
    try {
      await sql.from('photo').insert([
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
    } catch (err) {
      console.warn('Failed inserting photos:', err);
    }

    // Insert tags
    try {
      await sql.from('tag').insert([
        { name: 'nature' },
        { name: 'water' },
        { name: 'sky' },
        { name: 'people' },
        { name: 'Summer Contest' },
      ]);
    } catch (err) {
      console.warn('Failed inserting tags:', err);
    }

    // Insert photo tags
    try {
      await sql.from('phototag').insert([
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
    } catch (err) {
      console.warn('Failed inserting phototags:', err);
    }

    // Insert events
    try {
      await sql.from('event').insert([
        { id: 1, name: 'Spring Photo Walk', startdate: '2025-04-12 09:00:00', enddate: '2025-04-12 17:00:00', tag: 'nature', description: 'A community walk to photograph spring blooms.', herofile: '01.png' },
        { id: 2, name: 'Summer Contest', startdate: '2025-07-01 00:00:00', enddate: '2025-07-31 23:59:59', tag: 'Summer Contest', description: 'Monthly summer photo contest; open to all members.', herofile: '05.png' },
        { id: 3, name: 'Night Sky Workshop', startdate: '2025-09-15 20:00:00', enddate: '2025-09-15 23:30:00', tag: 'sky', description: 'Learn long exposure techniques for astrophotography.', herofile: '09.png' },
        { id: 4, name: 'Waterfall Hike', startdate: '2025-05-20 08:00:00', enddate: '2025-05-20 14:00:00', tag: 'water', description: 'Day trip to nearby waterfall for landscape shots.', herofile: '02.png' },
        { id: 5, name: 'Portrait Session', startdate: '2025-11-08 18:00:00', enddate: '2025-11-08 20:00:00', tag: 'people', description: 'Portrait lighting and posing session.', herofile: '07.png' },
      ]);
    } catch (err) {
      console.warn('Failed inserting events:', err);
    }

    // no connection to close for supabase client

    return {
      users: testUsers,
    };
  } catch (error) {
    throw error;
  }
}

/**
 * Creates test users using Supabase Admin Auth API
 * Returns an array of created users with their IDs
 */
async function createTestUsers(client: ReturnType<typeof createClient<Database>>): Promise<TestUser[]> {
  const testUsers: TestUser[] = [
    {
      email: 'amoinus@gmail.com',
      password: 'testpassword123',
      username: 'max 1',
      role: 'eboard',
      id: '43188856-13db-410a-b1a2-b006056cd84f',
    },
    {
      email: 'maxwelltang@umass.edu',
      password: 'testpassword123',
      username: 'max 2',
      role: 'member',
      id: 'beebdcae-ba00-4c16-9e1c-2103381337bf',
    },
  ];

  try {
    for (const user of testUsers) {
      // If a user with this email already exists in auth, remove it first
      try {
        const { data: existingUsers } = await client.auth.admin.listUsers();
        const existing = existingUsers?.users?.find(u => u.email === user.email);
        
        if (existing) {
          await client.auth.admin.deleteUser(existing.id);
          console.log(`Removed existing auth user for email ${user.email} with id ${existing.id}`);
        }
      } catch (e) {
        // ignore lookup/delete errors and continue
        console.warn(`Warning checking/removing existing user ${user.email}:`, e);
      }

      console.log(`Creating test user: ${user.email} with ID: ${user.id}`);

      try {
        // Use admin API to create user (service role key required)
        const { data, error } = await client.auth.admin.createUser({
          id: user.id,
          email: user.email,
          password: user.password,
          email_confirm: true,
          user_metadata: {},
        });

        if (error) {
          throw error;
        }

        // Update the user ID with the actual created ID
        if (data?.user?.id) {
          user.id = data.user.id;
        }

        console.log(`Created test user: ${user.email} with ID: ${user.id}`);
      } catch (err) {
        console.error('Error creating test user via supabase admin:', err);
        throw err;
      }
    }
  } catch (error) {
    throw new Error(`Failed to create test users: ${error}`);
  }

  return testUsers;
}
