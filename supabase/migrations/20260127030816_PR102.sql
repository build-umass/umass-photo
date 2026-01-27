drop policy "Allow everyone to select blogs" on "public"."blog";

drop policy "Allow everyone to select events" on "public"."event";

drop policy "Allow everyone to select photos" on "public"."photo";

drop policy "Allow everyone to select roles" on "public"."photoclubrole";

drop policy "Allow everyone to select users" on "public"."photoclubuser";

drop policy "Allow everyone to select phototags" on "public"."phototag";

drop policy "Allow everyone to select tags" on "public"."tag";


  create policy "Allow everyone to select blogs"
  on "public"."blog"
  as permissive
  for select
  to public
using (true);



  create policy "Allow everyone to select events"
  on "public"."event"
  as permissive
  for select
  to public
using (true);



  create policy "Allow everyone to select photos"
  on "public"."photo"
  as permissive
  for select
  to public
using (true);



  create policy "Allow everyone to select roles"
  on "public"."photoclubrole"
  as permissive
  for select
  to public
using (true);



  create policy "Allow everyone to select users"
  on "public"."photoclubuser"
  as permissive
  for select
  to public
using (true);



  create policy "Allow everyone to select phototags"
  on "public"."phototag"
  as permissive
  for select
  to public
using (true);



  create policy "Allow everyone to select tags"
  on "public"."tag"
  as permissive
  for select
  to public
using (true);



