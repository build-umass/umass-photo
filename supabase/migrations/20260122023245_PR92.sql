
  create policy "Allow everyone to manage phototags for photos they are authors "
  on "public"."phototag"
  as permissive
  for all
  to public
with check ((( SELECT auth.uid() AS uid) = ( SELECT photo.authorid
   FROM public.photo
  WHERE (photo.id = phototag.photoid))));



  create policy "Allow everyone to create tags"
  on "public"."tag"
  as permissive
  for insert
  to authenticated
with check (true);



