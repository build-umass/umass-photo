drop policy "Allow admins to manage blogs" on "public"."blog";

drop policy "Allow admins to manage events" on "public"."event";

drop policy "Allow admins to manage photos" on "public"."photo";

drop policy "Allow admins to manage roles" on "public"."photoclubrole";

drop policy "Allow admins to manage users" on "public"."photoclubuser";

drop policy "Allow admins to manage phototags" on "public"."phototag";

drop policy "Allow admins to manage tags" on "public"."tag";

drop function if exists "private"."has_good_role"();

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.has_good_role()
 RETURNS boolean
 LANGUAGE sql
 SECURITY DEFINER
AS $function$
SELECT "public"."photoclubrole"."is_admin"
FROM "public"."photoclubuser"
    JOIN "public"."photoclubrole" ON "public"."photoclubuser"."role" = "public"."photoclubrole"."roleid"
WHERE (
        SELECT auth.uid()
    ) = "public"."photoclubuser"."id" $function$
;


  create policy "Allow admins to manage blogs"
  on "public"."blog"
  as permissive
  for all
  to authenticated
using (( SELECT public.has_good_role() AS has_good_role))
with check (( SELECT public.has_good_role() AS has_good_role));



  create policy "Allow admins to manage events"
  on "public"."event"
  as permissive
  for all
  to authenticated
using (( SELECT public.has_good_role() AS has_good_role))
with check (( SELECT public.has_good_role() AS has_good_role));



  create policy "Allow admins to manage photos"
  on "public"."photo"
  as permissive
  for all
  to authenticated
using (( SELECT public.has_good_role() AS has_good_role))
with check (( SELECT public.has_good_role() AS has_good_role));



  create policy "Allow admins to manage roles"
  on "public"."photoclubrole"
  as permissive
  for all
  to authenticated
using (( SELECT public.has_good_role() AS has_good_role))
with check (( SELECT public.has_good_role() AS has_good_role));



  create policy "Allow admins to manage users"
  on "public"."photoclubuser"
  as permissive
  for all
  to authenticated
using (( SELECT public.has_good_role() AS has_good_role))
with check (( SELECT public.has_good_role() AS has_good_role));



  create policy "Allow admins to manage phototags"
  on "public"."phototag"
  as permissive
  for all
  to authenticated
using (( SELECT public.has_good_role() AS has_good_role))
with check (( SELECT public.has_good_role() AS has_good_role));



  create policy "Allow admins to manage tags"
  on "public"."tag"
  as permissive
  for all
  to authenticated
using (( SELECT public.has_good_role() AS has_good_role))
with check (( SELECT public.has_good_role() AS has_good_role));


drop schema if exists "private";


