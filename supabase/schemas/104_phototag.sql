CREATE TABLE phototag (
  photoid INTEGER REFERENCES photo (id) ON DELETE CASCADE NOT NULL,
  tag VARCHAR(32) REFERENCES tag (name) ON DELETE CASCADE NOT NULL
);


ALTER TABLE public.phototag enable ROW level security;


CREATE POLICY "Allow admins to manage phototags" ON "public"."phototag" AS permissive FOR ALL TO authenticated USING (
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


CREATE POLICY "Allow everyone to select phototags" ON "public"."phototag" AS permissive FOR
SELECT
  USING (TRUE);


CREATE POLICY "Allow everyone to manage phototags for photos they are authors of" ON "public"."phototag" AS permissive FOR ALL USING (
  (
    SELECT
      auth.uid ()
  ) = (
    SELECT
      authorid
    FROM
      photo
    WHERE
      photo.id = photoid
  )
)
WITH
  CHECK (
    (
      SELECT
        auth.uid ()
    ) = (
      SELECT
        authorid
      FROM
        photo
      WHERE
        photo.id = photoid
    )
  );
