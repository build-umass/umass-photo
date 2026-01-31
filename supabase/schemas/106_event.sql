CREATE TABLE event (
    id INTEGER PRIMARY KEY DEFAULT FLOOR(random() * 2147483647),
    name VARCHAR(64) NOT NULL,
    startdate TIMESTAMPTZ NOT NULL,
    enddate TIMESTAMPTZ NOT NULL,
    tag VARCHAR(32) REFERENCES tag(name) NOT NULL,
    description TEXT NOT NULL,
    herofile VARCHAR(128) NOT NULL
);
ALTER TABLE public.event enable ROW LEVEL SECURITY;
CREATE POLICY "Allow admins to manage events" ON "public"."event" AS PERMISSIVE FOR ALL TO authenticated USING (
    (
        SELECT public.is_admin()
    )
) WITH CHECK (
    (
        SELECT public.is_admin()
    )
);
CREATE POLICY "Allow everyone to select events" ON "public"."event" AS PERMISSIVE FOR
SELECT USING (true);