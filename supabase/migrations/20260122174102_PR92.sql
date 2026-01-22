drop policy "Allow everyone to manage photos that they are authors of" on "public"."photo";


  create policy "Allow everyone to manage photos that they are authors of"
  on "public"."photo"
  as permissive
  for all
  to public
using ((( SELECT auth.uid() AS uid) = authorid))
with check ((( SELECT auth.uid() AS uid) = authorid));



