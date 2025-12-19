CREATE OR REPLACE FUNCTION filter_photos(
    filtering_tags boolean,
    filtering_authors boolean,
    filtering_date boolean,
    querytags json,
    queryauthor UUID,
    querystart TIMESTAMPTZ,
    queryend TIMESTAMPTZ
) RETURNS SETOF photo AS $$
SELECT *
FROM photo p
WHERE
    (
        (NOT filtering_tags) OR (
            (
                SELECT COUNT(DISTINCT pt.tag)
                FROM phototag pt
                WHERE pt.photoid = p.id
                  AND pt.tag IN (
                      SELECT value FROM json_array_elements_text(querytags)
                  )
            ) = (
                SELECT COUNT(*) FROM json_array_elements_text(querytags)
            )
        )
    )
AND
    (
        (NOT filtering_authors) OR (p.authorid = queryauthor)
    )
AND
    (
        (NOT filtering_date) OR (p.postdate BETWEEN querystart AND queryend)
    ) 
ORDER BY
    CASE WHEN NOT filtering_date THEN p.postdate END DESC;
$$ LANGUAGE SQL;