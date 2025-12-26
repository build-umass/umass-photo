CREATE POLICY "Allow everyone to insert photos that they are authors of" ON "public"."photo" AS PERMISSIVE FOR
INSERT WITH CHECK (
    (
      SELECT auth.uid()
    ) = authorid
  );
CREATE POLICY "Allow everyone to insert their own profiles if they set safe roles" ON "public"."photoclubuser" AS PERMISSIVE FOR
INSERT TO public WITH CHECK (
    (
      (
        SELECT auth.uid()
      ) = id
    )
    AND (
      (
        SELECT is_admin
        FROM "public"."photoclubrole"
        WHERE roleid = role
      ) = false
    )
  );
CREATE POLICY "Allow admins to manage users" ON "public"."photoclubuser" AS PERMISSIVE FOR ALL TO public WITH CHECK (
  (
    SELECT "public"."photoclubrole"."is_admin"
    FROM "public"."photoclubuser"
      JOIN "public"."photoclubrole" ON "public"."photoclubuser"."role" = "public"."photoclubrole"."roleid"
    WHERE (
        SELECT auth.uid()
      ) = "public"."photoclubuser"."id"
  )
);
CREATE POLICY "Allow admins to manage events" ON "public"."event" AS PERMISSIVE FOR ALL TO authenticated USING (
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
CREATE POLICY "Allow everyone to select events" ON "public"."event" AS PERMISSIVE FOR
SELECT TO authenticated USING (true);
CREATE POLICY "Allow everyone to select photos" ON "public"."photo" AS PERMISSIVE FOR
SELECT TO authenticated USING (true);
CREATE POLICY "Allow everyone to select roles" ON "public"."photoclubrole" AS PERMISSIVE FOR
SELECT TO authenticated USING (true);
CREATE POLICY "Allow everyone to select users" ON "public"."photoclubuser" AS PERMISSIVE FOR
SELECT TO authenticated USING (true);
CREATE POLICY "Allow everyone to select phototags" ON "public"."phototag" AS PERMISSIVE FOR
SELECT TO authenticated USING (true);
CREATE POLICY "Allow everyone to select tags" ON "public"."tag" AS PERMISSIVE FOR
SELECT TO authenticated USING (true);