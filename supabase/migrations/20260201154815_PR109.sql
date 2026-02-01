
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

CREATE OR REPLACE FUNCTION public.is_banned(userid uuid)
 RETURNS boolean
 LANGUAGE sql
 STRICT
AS $function$
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



