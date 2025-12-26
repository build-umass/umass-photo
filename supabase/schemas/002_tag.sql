CREATE TABLE tag (name VARCHAR(32) PRIMARY KEY);
ALTER TABLE public.tag enable ROW LEVEL SECURITY;
CREATE POLICY "Allow admins to manage tags" ON "public"."tag" AS PERMISSIVE FOR ALL TO authenticated USING (
    (
        SELECT "public"."photoclubrole"."is_admin"
        FROM "public"."photoclubuser"
            JOIN "public"."photoclubrole" ON "public"."photoclubuser"."role" = "public"."photoclubrole"."roleid"
        WHERE (
                SELECT auth.uid()
            ) = "public"."photoclubuser"."id"
    )
);
CREATE POLICY "Allow everyone to select tags" ON "public"."tag" AS PERMISSIVE FOR
SELECT TO authenticated USING (true);