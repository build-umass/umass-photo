ALTER TABLE "public"."blog" ALTER COLUMN "id" DROP DEFAULT;

alter table "public"."blog" alter column "id" set data type uuid using gen_random_uuid();

alter table "public"."blog" alter column "id" set default gen_random_uuid();

drop sequence if exists "public"."blog_id_seq";


