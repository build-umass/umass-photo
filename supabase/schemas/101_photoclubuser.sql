CREATE TABLE photoclubuser (
  id UUID PRIMARY KEY REFERENCES auth.users (id) ON DELETE CASCADE,
  username VARCHAR(64) NOT NULL,
  email VARCHAR(128) NOT NULL,
  bio TEXT,
  role VARCHAR(16) REFERENCES photoclubrole (roleid) NOT NULL,
  profilepicture VARCHAR(128),
  email_opt_in BOOLEAN DEFAULT FALSE -- User consent for email marketing/newsletter
);


ALTER TABLE public.photoclubuser enable ROW level security;


CREATE OR REPLACE FUNCTION public.is_admin () returns BOOLEAN security definer
SET
  search_path = '' language sql AS $$
SELECT "public"."photoclubrole"."is_admin"
FROM "public"."photoclubuser"
    JOIN "public"."photoclubrole" ON "public"."photoclubuser"."role" = "public"."photoclubrole"."roleid"
WHERE (
        SELECT auth.uid()
    ) = "public"."photoclubuser"."id" $$;


CREATE POLICY "Allow admins to manage users" ON "public"."photoclubuser" AS permissive FOR ALL TO authenticated USING (
  (
    SELECT
      public.is_admin ()
  )
)
WITH
  CHECK (
    (
      SELECT
        public.is_admin ()
    )
  );


CREATE POLICY "Allow everyone to select users" ON "public"."photoclubuser" AS permissive FOR
SELECT
  USING (TRUE);


CREATE POLICY "Allow everyone to insert their own profiles if they set safe roles" ON "public"."photoclubuser" AS permissive FOR insert TO public
WITH
  CHECK (
    (
      (
        SELECT
          auth.uid ()
      ) = id
    )
    AND (
      (
        SELECT
          is_admin
        FROM
          "public"."photoclubrole"
        WHERE
          roleid = role
      ) = FALSE
    )
  );


-- This is placed here for dependency reasons
CREATE POLICY "Allow admins to manage roles" ON "public"."photoclubrole" AS permissive FOR ALL TO authenticated USING (
  (
    SELECT
      public.is_admin ()
  )
)
WITH
  CHECK (
    (
      SELECT
        public.is_admin ()
    )
  );
