CREATE OR REPLACE FUNCTION public.has_good_role() RETURNS BOOLEAN SECURITY DEFINER
SET search_path = '' LANGUAGE SQL AS $$
SELECT "public"."photoclubrole"."is_admin"
FROM "public"."photoclubuser"
    JOIN "public"."photoclubrole" ON "public"."photoclubuser"."role" = "public"."photoclubrole"."roleid"
WHERE (
        SELECT auth.uid()
    ) = "public"."photoclubuser"."id" $$;
