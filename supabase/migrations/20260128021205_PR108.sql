alter table "public"."blog" alter column "authorid" set default auth.uid();

alter table "public"."blog" alter column "postdate" set default CURRENT_TIMESTAMP;


