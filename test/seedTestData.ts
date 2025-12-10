import crypto from 'crypto';
import postgres from 'postgres';
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
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error('No database connection string found!');
  }

  const sql = postgres(connectionString);

  try {
    // Create test users directly in auth tables
    const testUsers = await createTestUsers();

    // Insert roles
    await sql`
      INSERT INTO photoclubrole (roleid, is_admin) VALUES
      ('admin',  true),
      ('member', false),
      ('eboard', true)
      ON CONFLICT DO NOTHING;
    `;

    // Insert users into photoclubuser table
    for (const user of testUsers) {
      await sql`
        INSERT INTO photoclubuser (id, username, email, bio, role) 
        VALUES (${user.id}, ${user.username}, ${user.email}, 'hi', ${user.role})
        ON CONFLICT DO NOTHING;
      `;
    }

    // Insert photos
    await sql`
      INSERT INTO photo (id, title, authorid, description, file, postdate) VALUES
      (1, 'title 1', ${testUsers[0].id}, 'description 1', '01.png', '2020-03-15 14:30:00'),
      (2, 'title 2', ${testUsers[1].id}, 'description 2', '02.png', '2020-07-22 16:45:00'),
      (3, 'title 3', ${testUsers[0].id}, 'description 3', '03.png', '2021-01-10 09:15:00'),
      (4, 'title 4', ${testUsers[1].id}, 'description 4', '04.png', '2021-05-18 12:20:00'),
      (5, 'title 5', ${testUsers[0].id}, 'description 5', '05.png', '2022-02-28 18:00:00'),
      (6, 'title 6', ${testUsers[1].id}, 'description 6', '06.png', '2022-08-14 11:30:00'),
      (7, 'title 7', ${testUsers[0].id}, 'description 7', '07.png', '2023-04-03 15:45:00'),
      (8, 'title 8', ${testUsers[1].id}, 'description 8', '08.png', '2023-11-12 13:10:00'),
      (9, 'title 9', ${testUsers[0].id}, 'description 9', '09.png', '2024-06-25 17:30:00')
      ON CONFLICT DO NOTHING;
    `;

    // Insert tags
    await sql`
      INSERT INTO tag (name) VALUES
      ('nature'),
      ('water'),
      ('sky'),
      ('people'),
      ('Summer Contest')
      ON CONFLICT DO NOTHING;
    `;

    // Insert photo tags
    await sql`
      INSERT INTO phototag (photoid, tag) VALUES
      (1, 'nature'),
      (1, 'sky'),
      (2, 'people'),
      (3, 'nature'),
      (3, 'sky'),
      (3, 'Summer Contest'),
      (5, 'nature'),
      (5, 'Summer Contest'),
      (5, 'Summer Contest'),
      (7, 'people'),
      (8, 'nature'),
      (9, 'sky')
      ON CONFLICT DO NOTHING;
    `;

    // Insert events
    await sql`
      INSERT INTO event (id, name, startdate, enddate, tag, description, herofile) VALUES
      (1, 'Spring Photo Walk',  '2025-04-12 09:00:00', '2025-04-12 17:00:00', 'nature',         'A community walk to photograph spring blooms.',        '01.png'),
      (2, 'Summer Contest',     '2025-07-01 00:00:00', '2025-07-31 23:59:59', 'Summer Contest', 'Monthly summer photo contest; open to all members.',   '05.png'),
      (3, 'Night Sky Workshop', '2025-09-15 20:00:00', '2025-09-15 23:30:00', 'sky',            'Learn long exposure techniques for astrophotography.', '09.png'),
      (4, 'Waterfall Hike',     '2025-05-20 08:00:00', '2025-05-20 14:00:00', 'water',          'Day trip to nearby waterfall for landscape shots.',    '02.png'),
      (5, 'Portrait Session',   '2025-11-08 18:00:00', '2025-11-08 20:00:00', 'people',         'Portrait lighting and posing session.',                '07.png')
      ON CONFLICT DO NOTHING;
    `;

    await sql.end();

    return {
      users: testUsers,
    };
  } catch (error) {
    await sql.end();
    throw error;
  }
}

/**
 * Creates test users by inserting directly into auth.users and auth.identities tables
 * Returns an array of created users with their IDs
 */
async function createTestUsers(): Promise<TestUser[]> {
  const testUsers: TestUser[] = [
    {
      email: 'max1@test.example.com',
      password: 'testpassword123',
      username: 'max 1',
      role: 'eboard',
      id: '', // Will be populated after creation
    },
    {
      email: 'max2@test.example.com',
      password: 'testpassword123',
      username: 'max 2',
      role: 'member',
      id: '', // Will be populated after creation
    },
  ];

  try {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      throw new Error('No database connection string found!');
    }

    const sql = postgres(connectionString);

    for (const user of testUsers) {
      // If a user with this email already exists in auth, remove it first
      const existing = await sql`SELECT id FROM auth.users WHERE email = ${user.email} LIMIT 1`;
      if (existing && existing.length > 0) {
        const existingId = existing[0].id;
        await sql`DELETE FROM auth.identities WHERE user_id = ${existingId}`;
        await sql`DELETE FROM auth.users WHERE id = ${existingId}`;
        console.log(`Removed existing auth user for email ${user.email} with id ${existingId}`);
      }

      // Generate a UUID for the new user
      const userId = crypto.randomUUID();
      user.id = userId;

      console.log(`Creating test user: ${user.email} with ID: ${userId}`);
      // Hash the password using bcrypt algorithm
      // For test purposes, using a pre-hashed password
      // In production, use a proper bcrypt library
      const encryptedPassword = await hashPassword(user.password);

      // Insert user into auth.users table
      await sql`
        INSERT INTO auth.users (
          instance_id,
          id,
          aud,
          role,
          email,
          encrypted_password,
          email_confirmed_at,
          recovery_sent_at,
          last_sign_in_at,
          raw_app_meta_data,
          raw_user_meta_data,
          created_at,
          updated_at,
          confirmation_token,
          email_change,
          email_change_token_new,
          recovery_token
        ) VALUES (
          '00000000-0000-0000-0000-000000000000',
          ${userId},
          'authenticated',
          'authenticated',
          ${user.email},
          ${encryptedPassword},
          now(),
          now(),
          now(),
          '{"provider":"email","providers":["email"]}'::jsonb,
          '{}'::jsonb,
          now(),
          now(),
          '',
          '',
          '',
          ''
        )
        ON CONFLICT DO NOTHING;
      `;

      // Insert user into auth.identities table
      await sql`
        INSERT INTO auth.identities (
          id,
          user_id,
          provider_id,
          identity_data,
          provider,
          last_sign_in_at,
          created_at,
          updated_at
        ) VALUES (
          ${crypto.randomUUID()},
          ${userId},
          ${userId},
          ${JSON.stringify({ sub: userId, email: user.email })},
          'email',
          now(),
          now(),
          now()
        )
        ON CONFLICT DO NOTHING;
      `;

      console.log(`Created test user: ${user.email} with ID: ${user.id}`);
    }

    await sql.end();
  } catch (error) {
    throw new Error(`Failed to create test users: ${error}`);
  }

  return testUsers;
}

/**
 * Hashes a password using Node.js crypto for bcrypt-like hashing
 * NOTE: For production use, use bcrypt or argon2 library
 */
async function hashPassword(password: string): Promise<string> {
  // Using a simple approach for tests - in production use bcrypt or argon2
  // Placeholder: Return a bcrypt-like hash format using the top-level `crypto` import
  return '$2a$10$' + crypto.createHash('sha256').update(password).digest('base64').substring(0, 53);
}

/**
 * Cleans up test users by deleting from auth tables
 */
export async function cleanupTestUsers(users: TestUser[]): Promise<void> {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error('No database connection string found!');
  }

  const sql = postgres(connectionString);

  try {
    for (const user of users) {
      console.log(`Cleaning up test user: ${user.email} with ID: ${user.id}`);

      // Delete from auth.identities first (due to foreign key constraint)
      await sql`DELETE FROM auth.identities WHERE user_id = ${user.id}`;
      
      // Delete from auth.users
      await sql`DELETE FROM auth.users WHERE id = ${user.id}`;
      
      console.log(`Deleted test user: ${user.email}`);
    }
  } catch (error) {
    console.error(`Failed to cleanup test users: ${error}`);
  } finally {
    await sql.end();
  }
}
