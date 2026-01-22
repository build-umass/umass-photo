CREATE TABLE photo (
    id INTEGER PRIMARY KEY DEFAULT FLOOR(random() * 2147483647),
    title VARCHAR(128) NOT NULL,
    description TEXT,
    authorid UUID REFERENCES photoclubuser(id) ON DELETE CASCADE NOT NULL,
    FILE VARCHAR(128) NOT NULL,
    postdate TIMESTAMPTZ NOT NULL
);
ALTER TABLE public.photo enable ROW LEVEL SECURITY;
CREATE POLICY "Allow admins to manage photos" ON "public"."photo" AS PERMISSIVE FOR ALL TO authenticated USING (
    (
        SELECT private.has_good_role()
    )
);
CREATE POLICY "Allow everyone to select photos" ON "public"."photo" AS PERMISSIVE FOR
SELECT TO authenticated USING (true);
CREATE POLICY "Allow everyone to manage photos that they are authors of" ON "public"."photo" AS PERMISSIVE FOR ALL USING (
    (
        SELECT auth.uid()
    ) = authorid
) WITH CHECK (
    (
        SELECT auth.uid()
    ) = authorid
);