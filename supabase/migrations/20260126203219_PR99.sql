alter table "public"."blog" drop column "file";

alter table "public"."blog" add column "content" text not null;


  create policy "Allow everyone to manage blogs that they are authors of"
  on "public"."blog"
  as permissive
  for all
  to public
using ((( SELECT auth.uid() AS uid) = authorid))
with check ((( SELECT auth.uid() AS uid) = authorid));



