CREATE TABLE blog (
    id SERIAL PRIMARY KEY,
    authorid UUID REFERENCES photoclubuser(id) ON DELETE CASCADE NOT NULL,
    content TEXT NOT NULL
);
ALTER TABLE public.blog enable ROW LEVEL SECURITY;
CREATE POLICY "Allow admins to manage blogs" ON "public"."blog" AS PERMISSIVE FOR ALL TO authenticated USING (
    (
        SELECT private.has_good_role()
    )
);
CREATE POLICY "Allow everyone to select blogs" ON "public"."blog" AS PERMISSIVE FOR
SELECT TO authenticated USING (true);
CREATE POLICY "Allow everyone to manage blogs that they are authors of" ON "public"."blog" AS PERMISSIVE FOR ALL USING (
    (
        SELECT auth.uid()
    ) = authorid
) WITH CHECK (
    (
        SELECT auth.uid()
    ) = authorid
);