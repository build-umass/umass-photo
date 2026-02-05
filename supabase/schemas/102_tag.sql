CREATE TABLE tag (name VARCHAR(32) PRIMARY KEY);


ALTER TABLE public.tag enable ROW level security;


CREATE POLICY "Allow admins to manage tags" ON "public"."tag" AS permissive FOR ALL TO authenticated USING (
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


CREATE POLICY "Allow everyone to select tags" ON "public"."tag" AS permissive FOR
SELECT
  USING (TRUE);


CREATE POLICY "Allow everyone to create tags" ON "public"."tag" AS permissive FOR insert TO authenticated
WITH
  CHECK (TRUE);
