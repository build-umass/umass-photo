create sequence "public"."blog_id_seq";


  create table "public"."blog" (
    "id" integer not null default nextval('public.blog_id_seq'::regclass),
    "authorid" uuid not null,
    "file" character varying(128) not null
      );


alter table "public"."blog" enable row level security;


  create table "public"."event" (
    "id" integer not null default floor((random() * (2147483647)::double precision)),
    "name" character varying(64) not null,
    "startdate" timestamp with time zone not null,
    "enddate" timestamp with time zone not null,
    "tag" character varying(32) not null,
    "description" text not null,
    "herofile" character varying(128) not null
      );


alter table "public"."event" enable row level security;


  create table "public"."photo" (
    "id" integer not null default floor((random() * (2147483647)::double precision)),
    "title" character varying(128) not null,
    "description" text,
    "authorid" uuid not null,
    "file" character varying(128) not null,
    "postdate" timestamp with time zone not null
      );


alter table "public"."photo" enable row level security;


  create table "public"."photoclubrole" (
    "roleid" character varying(16) not null,
    "is_admin" boolean not null
      );


alter table "public"."photoclubrole" enable row level security;


  create table "public"."photoclubuser" (
    "id" uuid not null,
    "username" character varying(64) not null,
    "email" character varying(128) not null,
    "bio" text,
    "role" character varying(16) not null
      );


alter table "public"."photoclubuser" enable row level security;


  create table "public"."phototag" (
    "photoid" integer not null,
    "tag" character varying(32) not null
      );


alter table "public"."phototag" enable row level security;


  create table "public"."tag" (
    "name" character varying(32) not null
      );


alter table "public"."tag" enable row level security;

alter sequence "public"."blog_id_seq" owned by "public"."blog"."id";

CREATE UNIQUE INDEX blog_pkey ON public.blog USING btree (id);

CREATE UNIQUE INDEX event_pkey ON public.event USING btree (id);

CREATE UNIQUE INDEX photo_pkey ON public.photo USING btree (id);

CREATE UNIQUE INDEX photoclubrole_pkey ON public.photoclubrole USING btree (roleid);

CREATE UNIQUE INDEX photoclubuser_pkey ON public.photoclubuser USING btree (id);

CREATE UNIQUE INDEX tag_pkey ON public.tag USING btree (name);

alter table "public"."blog" add constraint "blog_pkey" PRIMARY KEY using index "blog_pkey";

alter table "public"."event" add constraint "event_pkey" PRIMARY KEY using index "event_pkey";

alter table "public"."photo" add constraint "photo_pkey" PRIMARY KEY using index "photo_pkey";

alter table "public"."photoclubrole" add constraint "photoclubrole_pkey" PRIMARY KEY using index "photoclubrole_pkey";

alter table "public"."photoclubuser" add constraint "photoclubuser_pkey" PRIMARY KEY using index "photoclubuser_pkey";

alter table "public"."tag" add constraint "tag_pkey" PRIMARY KEY using index "tag_pkey";

alter table "public"."blog" add constraint "blog_authorid_fkey" FOREIGN KEY (authorid) REFERENCES public.photoclubuser(id) ON DELETE CASCADE not valid;

alter table "public"."blog" validate constraint "blog_authorid_fkey";

alter table "public"."event" add constraint "event_tag_fkey" FOREIGN KEY (tag) REFERENCES public.tag(name) not valid;

alter table "public"."event" validate constraint "event_tag_fkey";

alter table "public"."photo" add constraint "photo_authorid_fkey" FOREIGN KEY (authorid) REFERENCES public.photoclubuser(id) ON DELETE CASCADE not valid;

alter table "public"."photo" validate constraint "photo_authorid_fkey";

alter table "public"."photoclubuser" add constraint "photoclubuser_id_fkey" FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."photoclubuser" validate constraint "photoclubuser_id_fkey";

alter table "public"."photoclubuser" add constraint "photoclubuser_role_fkey" FOREIGN KEY (role) REFERENCES public.photoclubrole(roleid) not valid;

alter table "public"."photoclubuser" validate constraint "photoclubuser_role_fkey";

alter table "public"."phototag" add constraint "phototag_photoid_fkey" FOREIGN KEY (photoid) REFERENCES public.photo(id) ON DELETE CASCADE not valid;

alter table "public"."phototag" validate constraint "phototag_photoid_fkey";

alter table "public"."phototag" add constraint "phototag_tag_fkey" FOREIGN KEY (tag) REFERENCES public.tag(name) ON DELETE CASCADE not valid;

alter table "public"."phototag" validate constraint "phototag_tag_fkey";

set check_function_bodies = off;

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

grant delete on table "public"."blog" to "anon";

grant insert on table "public"."blog" to "anon";

grant references on table "public"."blog" to "anon";

grant select on table "public"."blog" to "anon";

grant trigger on table "public"."blog" to "anon";

grant truncate on table "public"."blog" to "anon";

grant update on table "public"."blog" to "anon";

grant delete on table "public"."blog" to "authenticated";

grant insert on table "public"."blog" to "authenticated";

grant references on table "public"."blog" to "authenticated";

grant select on table "public"."blog" to "authenticated";

grant trigger on table "public"."blog" to "authenticated";

grant truncate on table "public"."blog" to "authenticated";

grant update on table "public"."blog" to "authenticated";

grant delete on table "public"."blog" to "service_role";

grant insert on table "public"."blog" to "service_role";

grant references on table "public"."blog" to "service_role";

grant select on table "public"."blog" to "service_role";

grant trigger on table "public"."blog" to "service_role";

grant truncate on table "public"."blog" to "service_role";

grant update on table "public"."blog" to "service_role";

grant delete on table "public"."event" to "anon";

grant insert on table "public"."event" to "anon";

grant references on table "public"."event" to "anon";

grant select on table "public"."event" to "anon";

grant trigger on table "public"."event" to "anon";

grant truncate on table "public"."event" to "anon";

grant update on table "public"."event" to "anon";

grant delete on table "public"."event" to "authenticated";

grant insert on table "public"."event" to "authenticated";

grant references on table "public"."event" to "authenticated";

grant select on table "public"."event" to "authenticated";

grant trigger on table "public"."event" to "authenticated";

grant truncate on table "public"."event" to "authenticated";

grant update on table "public"."event" to "authenticated";

grant delete on table "public"."event" to "service_role";

grant insert on table "public"."event" to "service_role";

grant references on table "public"."event" to "service_role";

grant select on table "public"."event" to "service_role";

grant trigger on table "public"."event" to "service_role";

grant truncate on table "public"."event" to "service_role";

grant update on table "public"."event" to "service_role";

grant delete on table "public"."photo" to "anon";

grant insert on table "public"."photo" to "anon";

grant references on table "public"."photo" to "anon";

grant select on table "public"."photo" to "anon";

grant trigger on table "public"."photo" to "anon";

grant truncate on table "public"."photo" to "anon";

grant update on table "public"."photo" to "anon";

grant delete on table "public"."photo" to "authenticated";

grant insert on table "public"."photo" to "authenticated";

grant references on table "public"."photo" to "authenticated";

grant select on table "public"."photo" to "authenticated";

grant trigger on table "public"."photo" to "authenticated";

grant truncate on table "public"."photo" to "authenticated";

grant update on table "public"."photo" to "authenticated";

grant delete on table "public"."photo" to "service_role";

grant insert on table "public"."photo" to "service_role";

grant references on table "public"."photo" to "service_role";

grant select on table "public"."photo" to "service_role";

grant trigger on table "public"."photo" to "service_role";

grant truncate on table "public"."photo" to "service_role";

grant update on table "public"."photo" to "service_role";

grant delete on table "public"."photoclubrole" to "anon";

grant insert on table "public"."photoclubrole" to "anon";

grant references on table "public"."photoclubrole" to "anon";

grant select on table "public"."photoclubrole" to "anon";

grant trigger on table "public"."photoclubrole" to "anon";

grant truncate on table "public"."photoclubrole" to "anon";

grant update on table "public"."photoclubrole" to "anon";

grant delete on table "public"."photoclubrole" to "authenticated";

grant insert on table "public"."photoclubrole" to "authenticated";

grant references on table "public"."photoclubrole" to "authenticated";

grant select on table "public"."photoclubrole" to "authenticated";

grant trigger on table "public"."photoclubrole" to "authenticated";

grant truncate on table "public"."photoclubrole" to "authenticated";

grant update on table "public"."photoclubrole" to "authenticated";

grant delete on table "public"."photoclubrole" to "service_role";

grant insert on table "public"."photoclubrole" to "service_role";

grant references on table "public"."photoclubrole" to "service_role";

grant select on table "public"."photoclubrole" to "service_role";

grant trigger on table "public"."photoclubrole" to "service_role";

grant truncate on table "public"."photoclubrole" to "service_role";

grant update on table "public"."photoclubrole" to "service_role";

grant delete on table "public"."photoclubuser" to "anon";

grant insert on table "public"."photoclubuser" to "anon";

grant references on table "public"."photoclubuser" to "anon";

grant select on table "public"."photoclubuser" to "anon";

grant trigger on table "public"."photoclubuser" to "anon";

grant truncate on table "public"."photoclubuser" to "anon";

grant update on table "public"."photoclubuser" to "anon";

grant delete on table "public"."photoclubuser" to "authenticated";

grant insert on table "public"."photoclubuser" to "authenticated";

grant references on table "public"."photoclubuser" to "authenticated";

grant select on table "public"."photoclubuser" to "authenticated";

grant trigger on table "public"."photoclubuser" to "authenticated";

grant truncate on table "public"."photoclubuser" to "authenticated";

grant update on table "public"."photoclubuser" to "authenticated";

grant delete on table "public"."photoclubuser" to "service_role";

grant insert on table "public"."photoclubuser" to "service_role";

grant references on table "public"."photoclubuser" to "service_role";

grant select on table "public"."photoclubuser" to "service_role";

grant trigger on table "public"."photoclubuser" to "service_role";

grant truncate on table "public"."photoclubuser" to "service_role";

grant update on table "public"."photoclubuser" to "service_role";

grant delete on table "public"."phototag" to "anon";

grant insert on table "public"."phototag" to "anon";

grant references on table "public"."phototag" to "anon";

grant select on table "public"."phototag" to "anon";

grant trigger on table "public"."phototag" to "anon";

grant truncate on table "public"."phototag" to "anon";

grant update on table "public"."phototag" to "anon";

grant delete on table "public"."phototag" to "authenticated";

grant insert on table "public"."phototag" to "authenticated";

grant references on table "public"."phototag" to "authenticated";

grant select on table "public"."phototag" to "authenticated";

grant trigger on table "public"."phototag" to "authenticated";

grant truncate on table "public"."phototag" to "authenticated";

grant update on table "public"."phototag" to "authenticated";

grant delete on table "public"."phototag" to "service_role";

grant insert on table "public"."phototag" to "service_role";

grant references on table "public"."phototag" to "service_role";

grant select on table "public"."phototag" to "service_role";

grant trigger on table "public"."phototag" to "service_role";

grant truncate on table "public"."phototag" to "service_role";

grant update on table "public"."phototag" to "service_role";

grant delete on table "public"."tag" to "anon";

grant insert on table "public"."tag" to "anon";

grant references on table "public"."tag" to "anon";

grant select on table "public"."tag" to "anon";

grant trigger on table "public"."tag" to "anon";

grant truncate on table "public"."tag" to "anon";

grant update on table "public"."tag" to "anon";

grant delete on table "public"."tag" to "authenticated";

grant insert on table "public"."tag" to "authenticated";

grant references on table "public"."tag" to "authenticated";

grant select on table "public"."tag" to "authenticated";

grant trigger on table "public"."tag" to "authenticated";

grant truncate on table "public"."tag" to "authenticated";

grant update on table "public"."tag" to "authenticated";

grant delete on table "public"."tag" to "service_role";

grant insert on table "public"."tag" to "service_role";

grant references on table "public"."tag" to "service_role";

grant select on table "public"."tag" to "service_role";

grant trigger on table "public"."tag" to "service_role";

grant truncate on table "public"."tag" to "service_role";

grant update on table "public"."tag" to "service_role";


  create policy "Allow admins to manage blogs"
  on "public"."blog"
  as permissive
  for all
  to authenticated
using (( SELECT photoclubrole.is_admin
   FROM (public.photoclubuser
     JOIN public.photoclubrole ON (((photoclubuser.role)::text = (photoclubrole.roleid)::text)))
  WHERE (( SELECT auth.uid() AS uid) = photoclubuser.id)));



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
using (( SELECT photoclubrole.is_admin
   FROM (public.photoclubuser
     JOIN public.photoclubrole ON (((photoclubuser.role)::text = (photoclubrole.roleid)::text)))
  WHERE (( SELECT auth.uid() AS uid) = photoclubuser.id)));



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
using (( SELECT photoclubrole.is_admin
   FROM (public.photoclubuser
     JOIN public.photoclubrole ON (((photoclubuser.role)::text = (photoclubrole.roleid)::text)))
  WHERE (( SELECT auth.uid() AS uid) = photoclubuser.id)));



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
using (( SELECT photoclubrole_1.is_admin
   FROM (public.photoclubuser
     JOIN public.photoclubrole photoclubrole_1 ON (((photoclubuser.role)::text = (photoclubrole_1.roleid)::text)))
  WHERE (( SELECT auth.uid() AS uid) = photoclubuser.id)));



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
with check (( SELECT photoclubrole.is_admin
   FROM (public.photoclubuser photoclubuser_1
     JOIN public.photoclubrole ON (((photoclubuser_1.role)::text = (photoclubrole.roleid)::text)))
  WHERE (( SELECT auth.uid() AS uid) = photoclubuser_1.id)));



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
using (( SELECT photoclubrole.is_admin
   FROM (public.photoclubuser
     JOIN public.photoclubrole ON (((photoclubuser.role)::text = (photoclubrole.roleid)::text)))
  WHERE (( SELECT auth.uid() AS uid) = photoclubuser.id)));



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
using (( SELECT photoclubrole.is_admin
   FROM (public.photoclubuser
     JOIN public.photoclubrole ON (((photoclubuser.role)::text = (photoclubrole.roleid)::text)))
  WHERE (( SELECT auth.uid() AS uid) = photoclubuser.id)));



  create policy "Allow everyone to select tags"
  on "public"."tag"
  as permissive
  for select
  to authenticated
using (true);



