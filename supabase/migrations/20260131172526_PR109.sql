set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.filter_photos(filtering_tags boolean, filtering_authors boolean, filtering_date boolean, querytags json, queryauthor uuid, querystart timestamp with time zone, queryend timestamp with time zone)
 RETURNS SETOF public.photo
 LANGUAGE sql
 SET search_path TO ''
AS $function$
SELECT *
FROM public.photo p
WHERE (
        (NOT filtering_tags)
        OR (
            (
                SELECT COUNT(DISTINCT pt.tag)
                FROM public.phototag pt
                WHERE pt.photoid = p.id
                    AND pt.tag IN (
                        SELECT value
                        FROM json_array_elements_text(querytags)
                    )
            ) = (
                SELECT COUNT(*)
                FROM json_array_elements_text(querytags)
            )
        )
    )
    AND (
        (NOT filtering_authors)
        OR (p.authorid = queryauthor)
    )
    AND (
        (NOT filtering_date)
        OR (
            p.postdate BETWEEN querystart AND queryend
        )
    )
ORDER BY CASE
        WHEN NOT filtering_date THEN p.postdate
    END DESC;
$function$
;


