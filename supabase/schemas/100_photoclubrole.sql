CREATE TABLE photoclubrole (
  roleid VARCHAR(16) PRIMARY KEY,
  is_admin BOOLEAN NOT NULL
);


ALTER TABLE public.photoclubrole enable ROW level security;


CREATE POLICY "Allow everyone to select roles" ON "public"."photoclubrole" AS permissive FOR
SELECT
  USING (TRUE);


-- Admin management policy is added in 001_photoclubuser.sql for dependency reasons
