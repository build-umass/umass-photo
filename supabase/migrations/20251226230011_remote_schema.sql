


SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";






CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";






CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";





SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."blog" (
    "id" integer NOT NULL,
    "authorid" "uuid" NOT NULL,
    "file" character varying(128) NOT NULL
);


ALTER TABLE "public"."blog" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."blog_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."blog_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."blog_id_seq" OWNED BY "public"."blog"."id";



CREATE TABLE IF NOT EXISTS "public"."event" (
    "id" integer DEFAULT "floor"(("random"() * (2147483647)::double precision)) NOT NULL,
    "name" character varying(64) NOT NULL,
    "startdate" timestamp with time zone NOT NULL,
    "enddate" timestamp with time zone NOT NULL,
    "tag" character varying(32) NOT NULL,
    "description" "text" NOT NULL,
    "herofile" character varying(128) NOT NULL
);


ALTER TABLE "public"."event" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."photo" (
    "id" integer DEFAULT "floor"(("random"() * (2147483647)::double precision)) NOT NULL,
    "title" character varying(128) NOT NULL,
    "description" "text",
    "authorid" "uuid" NOT NULL,
    "file" character varying(128) NOT NULL,
    "postdate" timestamp with time zone NOT NULL
);


ALTER TABLE "public"."photo" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."photoclubrole" (
    "roleid" character varying(16) NOT NULL,
    "is_admin" boolean NOT NULL
);


ALTER TABLE "public"."photoclubrole" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."photoclubuser" (
    "id" "uuid" NOT NULL,
    "username" character varying(64) NOT NULL,
    "email" character varying(128) NOT NULL,
    "bio" "text",
    "role" character varying(16) NOT NULL
);


ALTER TABLE "public"."photoclubuser" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."phototag" (
    "photoid" integer NOT NULL,
    "tag" character varying(32) NOT NULL
);


ALTER TABLE "public"."phototag" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."tag" (
    "name" character varying(32) NOT NULL
);


ALTER TABLE "public"."tag" OWNER TO "postgres";


ALTER TABLE ONLY "public"."blog" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."blog_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."blog"
    ADD CONSTRAINT "blog_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."event"
    ADD CONSTRAINT "event_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."photo"
    ADD CONSTRAINT "photo_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."photoclubrole"
    ADD CONSTRAINT "photoclubrole_pkey" PRIMARY KEY ("roleid");



ALTER TABLE ONLY "public"."photoclubuser"
    ADD CONSTRAINT "photoclubuser_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."tag"
    ADD CONSTRAINT "tag_pkey" PRIMARY KEY ("name");



ALTER TABLE ONLY "public"."blog"
    ADD CONSTRAINT "blog_authorid_fkey" FOREIGN KEY ("authorid") REFERENCES "public"."photoclubuser"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."event"
    ADD CONSTRAINT "event_tag_fkey" FOREIGN KEY ("tag") REFERENCES "public"."tag"("name");



ALTER TABLE ONLY "public"."photo"
    ADD CONSTRAINT "photo_authorid_fkey" FOREIGN KEY ("authorid") REFERENCES "public"."photoclubuser"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."photoclubuser"
    ADD CONSTRAINT "photoclubuser_id_fkey" FOREIGN KEY ("id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."photoclubuser"
    ADD CONSTRAINT "photoclubuser_role_fkey" FOREIGN KEY ("role") REFERENCES "public"."photoclubrole"("roleid");



ALTER TABLE ONLY "public"."phototag"
    ADD CONSTRAINT "phototag_photoid_fkey" FOREIGN KEY ("photoid") REFERENCES "public"."photo"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."phototag"
    ADD CONSTRAINT "phototag_tag_fkey" FOREIGN KEY ("tag") REFERENCES "public"."tag"("name") ON DELETE CASCADE;





ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";


GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";








































































































































































GRANT ALL ON TABLE "public"."blog" TO "anon";
GRANT ALL ON TABLE "public"."blog" TO "authenticated";
GRANT ALL ON TABLE "public"."blog" TO "service_role";



GRANT ALL ON SEQUENCE "public"."blog_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."blog_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."blog_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."event" TO "anon";
GRANT ALL ON TABLE "public"."event" TO "authenticated";
GRANT ALL ON TABLE "public"."event" TO "service_role";



GRANT ALL ON TABLE "public"."photo" TO "anon";
GRANT ALL ON TABLE "public"."photo" TO "authenticated";
GRANT ALL ON TABLE "public"."photo" TO "service_role";



GRANT ALL ON TABLE "public"."photoclubrole" TO "anon";
GRANT ALL ON TABLE "public"."photoclubrole" TO "authenticated";
GRANT ALL ON TABLE "public"."photoclubrole" TO "service_role";



GRANT ALL ON TABLE "public"."photoclubuser" TO "anon";
GRANT ALL ON TABLE "public"."photoclubuser" TO "authenticated";
GRANT ALL ON TABLE "public"."photoclubuser" TO "service_role";



GRANT ALL ON TABLE "public"."phototag" TO "anon";
GRANT ALL ON TABLE "public"."phototag" TO "authenticated";
GRANT ALL ON TABLE "public"."phototag" TO "service_role";



GRANT ALL ON TABLE "public"."tag" TO "anon";
GRANT ALL ON TABLE "public"."tag" TO "authenticated";
GRANT ALL ON TABLE "public"."tag" TO "service_role";









ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "service_role";































drop extension if exists "pg_net";


  create policy "Everyone everything 1io9m69_0"
  on "storage"."objects"
  as permissive
  for select
  to public
using (true);



  create policy "Everyone everything 1io9m69_1"
  on "storage"."objects"
  as permissive
  for insert
  to public
with check (true);



  create policy "Everyone everything 1io9m69_2"
  on "storage"."objects"
  as permissive
  for update
  to public
using (true);



