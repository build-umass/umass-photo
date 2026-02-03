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


CREATE FUNCTION public.ban_affects_user (
  ban public.ban,
  photoclubuser public.photoclubuser
) returns BOOLEAN language sql stable strict
SET
  search_path = '' AS $$
SELECT
  (
    ban.email IS NULL
    OR photoclubuser.email LIKE ban.email
  )
  AND (
    ban.username IS NULL
    OR photoclubuser.username LIKE ban.username
  )
  AND (
    ban.ip IS NULL
    OR EXISTS (
      SELECT
        1
      FROM
        public.userip
      WHERE
        public.userip.userid = photoclubuser.id
        AND public.userip.ipaddress LIKE ban.ip
    )
  )
$$;


CREATE FUNCTION public.is_banned (photoclubuser public.photoclubuser) returns BOOLEAN language sql strict
SET
  search_path = '' AS $$
SELECT
  EXISTS (
    SELECT
      1
    FROM
      public.ban
    WHERE
      public.ban_affects_user(public.ban.*, photoclubuser)
  )
$$;


CREATE FUNCTION public.ban_affects_users (ban public.ban) returns setof public.photoclubuser language sql strict
SET
  search_path = '' AS $$
SELECT
  *
FROM
  public.photoclubuser
WHERE
  public.ban_affects_user (ban, public.photoclubuser.*)
$$;
