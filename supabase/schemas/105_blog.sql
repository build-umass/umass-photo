CREATE TABLE blog (
  id UUID PRIMARY KEY DEFAULT GEN_RANDOM_UUID(),
  authorid UUID REFERENCES photoclubuser (id) ON DELETE CASCADE NOT NULL DEFAULT auth.uid (),
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  postdate TIMESTAMPTZ NOT NULL DEFAULT current_timestamp
);


ALTER TABLE public.blog enable ROW level security;


CREATE POLICY "Allow admins to manage blogs" ON "public"."blog" AS permissive FOR ALL TO authenticated USING (
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


CREATE POLICY "Allow everyone to select blogs" ON "public"."blog" AS permissive FOR
SELECT
  USING (TRUE);


CREATE POLICY "Allow everyone to manage blogs that they are authors of" ON "public"."blog" AS permissive FOR ALL USING (
  (
    SELECT
      auth.uid ()
  ) = authorid
)
WITH
  CHECK (
    (
      SELECT
        auth.uid ()
    ) = authorid
  );
