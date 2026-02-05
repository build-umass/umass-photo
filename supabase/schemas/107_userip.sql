CREATE TABLE userip (
  userid UUID REFERENCES photoclubuser (id) ON DELETE CASCADE NOT NULL,
  ipaddress VARCHAR(32) NOT NULL
);


ALTER TABLE public.userip enable ROW level security;


CREATE POLICY "Allow admins to manage user ips" ON "public"."userip" AS permissive FOR ALL TO authenticated USING (
  (
    SELECT
      public.is_admin ()
  )
)
WITH
  CHECK (
    (
      SELECT
        public.is_admin ()
    )
  );
