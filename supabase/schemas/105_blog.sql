CREATE TABLE blog (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    authorid UUID REFERENCES photoclubuser(id) ON DELETE CASCADE NOT NULL DEFAULT auth.uid(),
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    postdate TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);
ALTER TABLE public.blog enable ROW LEVEL SECURITY;
CREATE POLICY "Allow admins to manage blogs" ON "public"."blog" AS PERMISSIVE FOR ALL TO authenticated USING (
    (
        SELECT public.has_good_role()
    )
) WITH CHECK (
    (
        SELECT public.has_good_role()
    )
);
CREATE POLICY "Allow everyone to select blogs" ON "public"."blog" AS PERMISSIVE FOR
SELECT USING (true);
CREATE POLICY "Allow everyone to manage blogs that they are authors of" ON "public"."blog" AS PERMISSIVE FOR ALL USING (
    (
        SELECT auth.uid()
    ) = authorid
) WITH CHECK (
    (
        SELECT auth.uid()
    ) = authorid
);