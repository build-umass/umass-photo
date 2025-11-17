CREATE POLICY "Enable insert for users based on user_id" ON "public"."photo" AS PERMISSIVE FOR
INSERT
  WITH CHECK (
    (
      SELECT
        auth.uid()
    ) = authorid
  );

CREATE POLICY "Allow users to create their own profiles if they set safe roles" ON "public"."photoclubuser" AS PERMISSIVE FOR
INSERT
  TO public WITH CHECK (
    (
      (
        SELECT
          auth.uid()
      ) = id
    )
    AND (
      (
        SELECT
          is_admin
        FROM
          "public"."photoclubrole"
        WHERE
          roleid = role
      ) = false
    )
  );

CREATE POLICY "Allow admins to manage people" ON "public"."photoclubuser" AS PERMISSIVE FOR
ALL
  TO public WITH CHECK (
    (
      SELECT
        "public"."photoclubrole"."is_admin"
      FROM
        "public"."photoclubuser"
        JOIN "public"."photoclubrole" ON "public"."photoclubuser"."role" = "public"."photoclubrole"."roleid"
      WHERE
        (
          SELECT
            auth.uid()
        ) = "public"."photoclubuser"."id"
    )
  );

CREATE POLICY "Only allow eboard to create events" ON "public"."event" AS PERMISSIVE FOR ALL TO authenticated USING (
  (
    SELECT
      "role"
    FROM
      "public"."photoclubuser"
    WHERE
      (
        SELECT
          auth.uid()
      ) = id
  ) = 'eboard'
);