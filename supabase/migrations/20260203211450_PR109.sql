drop function if exists "public"."is_banned"(userid uuid);

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.ban_affects_user(ban public.ban, photoclubuser public.photoclubuser)
 RETURNS boolean
 LANGUAGE sql
 STABLE STRICT
 SET search_path TO ''
AS $function$
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
$function$
;

CREATE OR REPLACE FUNCTION public.ban_affects_users(ban public.ban)
 RETURNS SETOF public.photoclubuser
 LANGUAGE sql
 STRICT
 SET search_path TO ''
AS $function$
SELECT
  *
FROM
  public.photoclubuser
WHERE
  public.ban_affects_user (ban, public.photoclubuser.*)
$function$
;

CREATE OR REPLACE FUNCTION public.is_banned(photoclubuser public.photoclubuser)
 RETURNS boolean
 LANGUAGE sql
 STRICT
 SET search_path TO ''
AS $function$
SELECT
  EXISTS (
    SELECT
      1
    FROM
      public.ban
    WHERE
      public.ban_affects_user(public.ban.*, photoclubuser)
  )
$function$
;


