CREATE TABLE tag (name VARCHAR(32) PRIMARY KEY);
ALTER TABLE public.tag enable ROW LEVEL SECURITY;
CREATE POLICY "Allow admins to manage tags" ON "public"."tag" AS PERMISSIVE FOR ALL TO authenticated USING (
    (
        SELECT private.has_good_role()
    )
);
CREATE POLICY "Allow everyone to select tags" ON "public"."tag" AS PERMISSIVE FOR
SELECT TO authenticated USING (true);