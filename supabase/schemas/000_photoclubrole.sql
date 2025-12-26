CREATE TABLE photoclubrole (
    roleid VARCHAR(16) PRIMARY KEY,
    is_admin BOOLEAN NOT NULL
);
ALTER TABLE public.photoclubrole enable ROW LEVEL SECURITY;
CREATE POLICY "Allow everyone to select roles" ON "public"."photoclubrole" AS PERMISSIVE FOR
SELECT TO authenticated USING (true);
-- Admin management policy is added in 001_photoclubuser.sql for dependency reasons