create extension if not exists "pg_net" with schema "extensions";

create schema if not exists "private";

alter table "public"."blog" enable row level security;

alter table "public"."event" enable row level security;

alter table "public"."photo" enable row level security;

alter table "public"."photoclubrole" enable row level security;

alter table "public"."photoclubuser" enable row level security;

alter table "public"."phototag" enable row level security;

alter table "public"."tag" enable row level security;

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION private.has_good_role()
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

CREATE OR REPLACE FUNCTION public.filter_photos(filtering_tags boolean, filtering_authors boolean, filtering_date boolean, querytags json, queryauthor uuid, querystart timestamp with time zone, queryend timestamp with time zone)
 RETURNS SETOF public.photo
 LANGUAGE sql
AS $function$
SELECT *
FROM photo p
WHERE (
        (NOT filtering_tags)
        OR (
            (
                SELECT COUNT(DISTINCT pt.tag)
                FROM phototag pt
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
    )
    AND (
        (NOT filtering_authors)
        OR (p.authorid = queryauthor)
    )
    AND (
        (NOT filtering_date)
        OR (
            p.postdate BETWEEN querystart AND queryend
        )
    )
ORDER BY CASE
        WHEN NOT filtering_date THEN p.postdate
    END DESC;
$function$
;


  create policy "Allow admins to manage blogs"
  on "public"."blog"
  as permissive
  for all
  to authenticated
using (( SELECT private.has_good_role() AS has_good_role));



  create policy "Allow everyone to select blogs"
  on "public"."blog"
  as permissive
  for select
  to authenticated
using (true);



  create policy "Allow admins to manage events"
  on "public"."event"
  as permissive
  for all
  to authenticated
using (( SELECT private.has_good_role() AS has_good_role));



  create policy "Allow everyone to select events"
  on "public"."event"
  as permissive
  for select
  to authenticated
using (true);



  create policy "Allow admins to manage photos"
  on "public"."photo"
  as permissive
  for all
  to authenticated
using (( SELECT private.has_good_role() AS has_good_role));



  create policy "Allow everyone to manage photos that they are authors of"
  on "public"."photo"
  as permissive
  for all
  to public
with check ((( SELECT auth.uid() AS uid) = authorid));



  create policy "Allow everyone to select photos"
  on "public"."photo"
  as permissive
  for select
  to authenticated
using (true);



  create policy "Allow admins to manage roles"
  on "public"."photoclubrole"
  as permissive
  for all
  to authenticated
using (( SELECT private.has_good_role() AS has_good_role));



  create policy "Allow everyone to select roles"
  on "public"."photoclubrole"
  as permissive
  for select
  to authenticated
using (true);



  create policy "Allow admins to manage users"
  on "public"."photoclubuser"
  as permissive
  for all
  to public
with check (( SELECT private.has_good_role() AS has_good_role));



  create policy "Allow everyone to insert their own profiles if they set safe ro"
  on "public"."photoclubuser"
  as permissive
  for insert
  to public
with check (((( SELECT auth.uid() AS uid) = id) AND (( SELECT photoclubrole.is_admin
   FROM public.photoclubrole
  WHERE ((photoclubrole.roleid)::text = (photoclubuser.role)::text)) = false)));



  create policy "Allow everyone to select users"
  on "public"."photoclubuser"
  as permissive
  for select
  to authenticated
using (true);



  create policy "Allow admins to manage phototags"
  on "public"."phototag"
  as permissive
  for all
  to authenticated
using (( SELECT private.has_good_role() AS has_good_role));



  create policy "Allow everyone to select phototags"
  on "public"."phototag"
  as permissive
  for select
  to authenticated
using (true);



  create policy "Allow admins to manage tags"
  on "public"."tag"
  as permissive
  for all
  to authenticated
using (( SELECT private.has_good_role() AS has_good_role));



  create policy "Allow everyone to select tags"
  on "public"."tag"
  as permissive
  for select
  to authenticated
using (true);


drop policy "Everyone everything 1io9m69_0" on "storage"."objects";

drop policy "Everyone everything 1io9m69_1" on "storage"."objects";

drop policy "Everyone everything 1io9m69_2" on "storage"."objects";


