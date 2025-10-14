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