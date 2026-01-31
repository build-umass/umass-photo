CREATE TABLE phototag (
    photoid INTEGER REFERENCES photo(id) ON DELETE CASCADE NOT NULL,
    tag VARCHAR(32) REFERENCES tag(name) ON DELETE CASCADE NOT NULL
);
ALTER TABLE public.phototag enable ROW LEVEL SECURITY;
CREATE POLICY "Allow admins to manage phototags" ON "public"."phototag" AS PERMISSIVE FOR ALL TO authenticated USING (
    (
        SELECT private.has_good_role()
    )
) WITH CHECK (
    (
        SELECT private.has_good_role()
    )
);
CREATE POLICY "Allow everyone to select phototags" ON "public"."phototag" AS PERMISSIVE FOR
SELECT USING (true);
CREATE POLICY "Allow everyone to manage phototags for photos they are authors of" ON "public"."phototag" AS PERMISSIVE FOR ALL WITH CHECK (
    (
        SELECT auth.uid()
    ) = (
        SELECT authorid
        FROM photo
        WHERE photo.id = photoid
    )
);