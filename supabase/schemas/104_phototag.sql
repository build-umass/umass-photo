CREATE TABLE phototag (
    photoid INTEGER REFERENCES photo(id) ON DELETE CASCADE NOT NULL,
    tag VARCHAR(32) REFERENCES tag(name) ON DELETE CASCADE NOT NULL
);
ALTER TABLE public.phototag enable ROW LEVEL SECURITY;
CREATE POLICY "Allow admins to manage phototags" ON "public"."phototag" AS PERMISSIVE FOR ALL TO authenticated USING (
    (
        SELECT private.has_good_role()
    )
);
CREATE POLICY "Allow everyone to select phototags" ON "public"."phototag" AS PERMISSIVE FOR
SELECT TO authenticated USING (true);