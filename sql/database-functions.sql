CREATE
OR REPLACE FUNCTION filter_tags(
    querytags json
) RETURNS SETOF photo AS $$
SELECT
    *
FROM
    photo
WHERE
    (
        SELECT
            COUNT(*)
        FROM
            json_array_elements(querytags) AS tagquery
            LEFT JOIN phototag ON phototag.tag = tagquery.value :: text
        WHERE
            phototag.photoid = photo.id
    ) = (
        SELECT
            COUNT(*)
        FROM
            json_array_elements(querytags)
    ) $$ LANGUAGE SQL;

CREATE
OR REPLACE FUNCTION filter_authors (queryauthor UUID) RETURNS SETOF photo as $$
SELECT
    *
FROM
    photo
WHERE
    (
        photo.authorid = queryauthor
) $$ LANGUAGE SQL;

CREATE
OR REPLACE FUNCTION filter_date (querystart TIMESTAMP, queryend TIMESTAMP) RETURNS SETOF photo as $$
SELECT
    *
FROM
    photo
WHERE
    (
        photo.postdate BETWEEN querystart
        AND queryend
    ) $$ LANGUAGE SQL;



-- querytags json
-- queryauthor varchar,
-- querytime TIMESTAMP,
-- queryend TIMESTAMP