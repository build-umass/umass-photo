CREATE TABLE blog (
    id SERIAL PRIMARY KEY,
    authorid UUID REFERENCES photoclubuser(id) ON DELETE CASCADE NOT NULL,
    FILE VARCHAR(128) NOT NULL
);
ALTER TABLE public.blog enable ROW LEVEL SECURITY;
CREATE POLICY "Allow admins to manage blogs" ON "public"."blog" AS PERMISSIVE FOR ALL TO authenticated USING (
    (
        SELECT "public"."photoclubrole"."is_admin"
        FROM "public"."photoclubuser"
            JOIN "public"."photoclubrole" ON "public"."photoclubuser"."role" = "public"."photoclubrole"."roleid"
        WHERE (
                SELECT auth.uid()
            ) = "public"."photoclubuser"."id"
    )
);
CREATE POLICY "Allow everyone to select blogs" ON "public"."blog" AS PERMISSIVE FOR
SELECT TO authenticated USING (true);