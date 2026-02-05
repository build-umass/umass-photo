drop policy "Allow admins to manage blogs" on "public"."blog";

drop policy "Allow admins to manage events" on "public"."event";

drop policy "Allow admins to manage photos" on "public"."photo";

drop policy "Allow admins to manage roles" on "public"."photoclubrole";

drop policy "Allow admins to manage users" on "public"."photoclubuser";

drop policy "Allow admins to manage phototags" on "public"."phototag";

drop policy "Allow everyone to manage phototags for photos they are authors " on "public"."phototag";

drop policy "Allow admins to manage tags" on "public"."tag";

drop function if exists "private"."has_good_role"();


  create table "public"."ban" (
    "id" uuid not null default gen_random_uuid(),
    "reason" text not null,
    "email" text,
    "ip" text,
    "username" text
      );


alter table "public"."ban" enable row level security;


  create table "public"."userip" (
    "userid" uuid not null,
    "ipaddress" character varying(32) not null
      );


alter table "public"."userip" enable row level security;

CREATE UNIQUE INDEX ban_pkey ON public.ban USING btree (id);

alter table "public"."ban" add constraint "ban_pkey" PRIMARY KEY using index "ban_pkey";

alter table "public"."userip" add constraint "userip_userid_fkey" FOREIGN KEY (userid) REFERENCES public.photoclubuser(id) ON DELETE CASCADE not valid;

alter table "public"."userip" validate constraint "userip_userid_fkey";

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

CREATE OR REPLACE FUNCTION public.is_admin()
 RETURNS boolean
 LANGUAGE sql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
SELECT "public"."photoclubrole"."is_admin"
FROM "public"."photoclubuser"
    JOIN "public"."photoclubrole" ON "public"."photoclubuser"."role" = "public"."photoclubrole"."roleid"
WHERE (
        SELECT auth.uid()
    ) = "public"."photoclubuser"."id" $function$
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

CREATE OR REPLACE FUNCTION public.filter_photos(filtering_tags boolean, filtering_authors boolean, filtering_date boolean, querytags json, queryauthor uuid, querystart timestamp with time zone, queryend timestamp with time zone)
 RETURNS SETOF public.photo
 LANGUAGE sql
 SET search_path TO ''
AS $function$
SELECT *
FROM public.photo p
WHERE (
        NOT filtering_tags
        OR (
            SELECT COUNT(DISTINCT pt.tag)
            FROM public.phototag pt
            WHERE pt.photoid = p.id
                AND pt.tag IN (
                    SELECT value
                    FROM json_array_elements_text(querytags)
                )
        ) = (
            SELECT COUNT(*)
            FROM json_array_elements_text(querytags)
        )
    )
    AND (
        NOT filtering_authors
        OR p.authorid = queryauthor
    )
    AND (
        NOT filtering_date
        OR p.postdate BETWEEN querystart AND queryend
    )
ORDER BY CASE
        WHEN NOT filtering_date THEN p.postdate
    END DESC;
$function$
;

grant delete on table "public"."ban" to "anon";

grant insert on table "public"."ban" to "anon";

grant references on table "public"."ban" to "anon";

grant select on table "public"."ban" to "anon";

grant trigger on table "public"."ban" to "anon";

grant truncate on table "public"."ban" to "anon";

grant update on table "public"."ban" to "anon";

grant delete on table "public"."ban" to "authenticated";

grant insert on table "public"."ban" to "authenticated";

grant references on table "public"."ban" to "authenticated";

grant select on table "public"."ban" to "authenticated";

grant trigger on table "public"."ban" to "authenticated";

grant truncate on table "public"."ban" to "authenticated";

grant update on table "public"."ban" to "authenticated";

grant delete on table "public"."ban" to "service_role";

grant insert on table "public"."ban" to "service_role";

grant references on table "public"."ban" to "service_role";

grant select on table "public"."ban" to "service_role";

grant trigger on table "public"."ban" to "service_role";

grant truncate on table "public"."ban" to "service_role";

grant update on table "public"."ban" to "service_role";

grant delete on table "public"."userip" to "anon";

grant insert on table "public"."userip" to "anon";

grant references on table "public"."userip" to "anon";

grant select on table "public"."userip" to "anon";

grant trigger on table "public"."userip" to "anon";

grant truncate on table "public"."userip" to "anon";

grant update on table "public"."userip" to "anon";

grant delete on table "public"."userip" to "authenticated";

grant insert on table "public"."userip" to "authenticated";

grant references on table "public"."userip" to "authenticated";

grant select on table "public"."userip" to "authenticated";

grant trigger on table "public"."userip" to "authenticated";

grant truncate on table "public"."userip" to "authenticated";

grant update on table "public"."userip" to "authenticated";

grant delete on table "public"."userip" to "service_role";

grant insert on table "public"."userip" to "service_role";

grant references on table "public"."userip" to "service_role";

grant select on table "public"."userip" to "service_role";

grant trigger on table "public"."userip" to "service_role";

grant truncate on table "public"."userip" to "service_role";

grant update on table "public"."userip" to "service_role";


  create policy "Allow admins to manage bans"
  on "public"."ban"
  as permissive
  for all
  to authenticated
using (( SELECT public.is_admin() AS is_admin))
with check (( SELECT public.is_admin() AS is_admin));



  create policy "Allow admins to manage user ips"
  on "public"."userip"
  as permissive
  for all
  to authenticated
using (( SELECT public.is_admin() AS is_admin))
with check (( SELECT public.is_admin() AS is_admin));



  create policy "Allow admins to manage blogs"
  on "public"."blog"
  as permissive
  for all
  to authenticated
using (( SELECT public.is_admin() AS is_admin))
with check (( SELECT public.is_admin() AS is_admin));



  create policy "Allow admins to manage events"
  on "public"."event"
  as permissive
  for all
  to authenticated
using (( SELECT public.is_admin() AS is_admin))
with check (( SELECT public.is_admin() AS is_admin));



  create policy "Allow admins to manage photos"
  on "public"."photo"
  as permissive
  for all
  to authenticated
using (( SELECT public.is_admin() AS is_admin))
with check (( SELECT public.is_admin() AS is_admin));



  create policy "Allow admins to manage roles"
  on "public"."photoclubrole"
  as permissive
  for all
  to authenticated
using (( SELECT public.is_admin() AS is_admin))
with check (( SELECT public.is_admin() AS is_admin));



  create policy "Allow admins to manage users"
  on "public"."photoclubuser"
  as permissive
  for all
  to authenticated
using (( SELECT public.is_admin() AS is_admin))
with check (( SELECT public.is_admin() AS is_admin));



  create policy "Allow admins to manage phototags"
  on "public"."phototag"
  as permissive
  for all
  to authenticated
using (( SELECT public.is_admin() AS is_admin))
with check (( SELECT public.is_admin() AS is_admin));



  create policy "Allow everyone to manage phototags for photos they are authors "
  on "public"."phototag"
  as permissive
  for all
  to public
using ((( SELECT auth.uid() AS uid) = ( SELECT photo.authorid
   FROM public.photo
  WHERE (photo.id = phototag.photoid))))
with check ((( SELECT auth.uid() AS uid) = ( SELECT photo.authorid
   FROM public.photo
  WHERE (photo.id = phototag.photoid))));



  create policy "Allow admins to manage tags"
  on "public"."tag"
  as permissive
  for all
  to authenticated
using (( SELECT public.is_admin() AS is_admin))
with check (( SELECT public.is_admin() AS is_admin));


drop schema if exists "private";


