CREATE TABLE photoclubuser (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    username VARCHAR(64) NOT NULL,
    email VARCHAR(128) NOT NULL,
    bio TEXT,
    role VARCHAR(16) REFERENCES photoclubrole(roleid) NOT NULL
);
ALTER TABLE public.photoclubuser enable ROW LEVEL SECURITY;
CREATE POLICY "Allow admins to manage users" ON "public"."photoclubuser" AS PERMISSIVE FOR ALL TO public WITH CHECK (
    (
        SELECT "public"."photoclubrole"."is_admin"
        FROM "public"."photoclubuser"
            JOIN "public"."photoclubrole" ON "public"."photoclubuser"."role" = "public"."photoclubrole"."roleid"
        WHERE (
                SELECT auth.uid()
            ) = "public"."photoclubuser"."id"
    )
);
CREATE POLICY "Allow everyone to select users" ON "public"."photoclubuser" AS PERMISSIVE FOR
SELECT TO authenticated USING (true);
CREATE POLICY "Allow everyone to insert their own profiles if they set safe roles" ON "public"."photoclubuser" AS PERMISSIVE FOR
INSERT TO public WITH CHECK (
    (
      (
        SELECT auth.uid()
      ) = id
    )
    AND (
      (
        SELECT is_admin
        FROM "public"."photoclubrole"
        WHERE roleid = role
      ) = false
    )
  );
-- This is placed here for dependency reasons
CREATE POLICY "Allow admins to manage roles" ON "public"."photoclubrole" AS PERMISSIVE FOR ALL TO authenticated USING (
    (
        SELECT "public"."photoclubrole"."is_admin"
        FROM "public"."photoclubuser"
            JOIN "public"."photoclubrole" ON "public"."photoclubuser"."role" = "public"."photoclubrole"."roleid"
        WHERE (
                SELECT auth.uid()
            ) = "public"."photoclubuser"."id"
    )
);