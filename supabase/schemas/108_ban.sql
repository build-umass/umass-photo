CREATE TABLE IF NOT EXISTS ban (
  id UUID PRIMARY KEY DEFAULT GEN_RANDOM_UUID(),
  reason TEXT NOT NULL,
  email TEXT,
  ip TEXT,
  username TEXT
);


ALTER TABLE public.ban enable ROW level security;


CREATE POLICY "Allow admins to manage bans" ON "public"."ban" AS permissive FOR ALL TO authenticated USING (
  (
    SELECT
      public.is_admin ()
  )
)
WITH
  CHECK (
    (
      SELECT
        public.is_admin ()
    )
  );


CREATE FUNCTION public.is_banned (userid UUID) returns BOOLEAN language sql strict AS $$
SELECT
  EXISTS (
    SELECT
      1
    FROM
      public.ban
      JOIN public.photoclubuser ON (
        public.ban.email IS NOT NULL
        AND public.photoclubuser.email LIKE public.ban.email
      )
    WHERE
      public.photoclubuser.id = userid
  )
  OR EXISTS (
    SELECT
      1
    FROM
      public.ban
      JOIN public.userip ON (
        public.ban.ip IS NOT NULL
        AND public.userip.ipaddress LIKE public.ban.ip
      )
    WHERE
      public.userip.userid = userid
  )
  OR EXISTS (
    SELECT
      1
    FROM
      public.ban
      JOIN public.photoclubuser ON (
        public.ban.username IS NOT NULL
        AND public.photoclubuser.username LIKE public.ban.username
      )
    WHERE
      public.photoclubuser.id = userid
  )
 $$;
