CREATE TABLE photoclubuser (
    id       SERIAL PRIMARY KEY,
    username VARCHAR(64) NOT NULL,
    email    VARCHAR(128) NOT NULL,
    bio      TEXT,
    role     VARCHAR(16)
);

CREATE TABLE blog (
    id       SERIAL PRIMARY KEY,
    authorid INTEGER REFERENCES photoclubuser(id) NOT NULL,
    file     VARCHAR(128) NOT NULL
);
