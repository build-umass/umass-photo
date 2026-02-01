CREATE FUNCTION filter_photos (
  filtering_tags BOOLEAN,
  filtering_authors BOOLEAN,
  filtering_date BOOLEAN,
  querytags JSON,
  queryauthor UUID,
  querystart TIMESTAMPTZ,
  queryend TIMESTAMPTZ
) returns setof public.photo language sql
SET
  search_path = '' AS $$
SELECT *
FROM public.photo p
WHERE (
        NOT filtering_tags
        OR (
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
    AND (
        NOT filtering_authors
        OR p.authorid = queryauthor
    )
    AND (
        NOT filtering_date
        OR p.postdate BETWEEN querystart AND queryend
    )
ORDER BY CASE
        WHEN NOT filtering_date THEN p.postdate
    END DESC;
$$;
