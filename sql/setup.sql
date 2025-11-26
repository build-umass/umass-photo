CREATE TABLE photoclubrole (
    roleid    VARCHAR(16) PRIMARY KEY,
    is_admin  BOOLEAN NOT NULL
);

CREATE TABLE photoclubuser (
    id       UUID PRIMARY KEY REFERENCES auth.users(id),
    username VARCHAR(64) NOT NULL,
    email    VARCHAR(128) NOT NULL,
    bio      TEXT,
    role     VARCHAR(16) REFERENCES photoclubrole(roleid) NOT NULL
);

CREATE TABLE blog (
    id       SERIAL PRIMARY KEY,
    authorid UUID REFERENCES photoclubuser(id) ON DELETE CASCADE NOT NULL,
    file     VARCHAR(128) NOT NULL
);

CREATE TABLE photo (
    id       PRIMARY KEY DEFAULT (random()*2147483647),
    title    VARCHAR(128) NOT NULL,
    description TEXT,
    authorid UUID REFERENCES photoclubuser(id) ON DELETE CASCADE NOT NULL,
    file     VARCHAR(128) NOT NULL,
    postdate TIMESTAMP NOT NULL
);

CREATE TABLE tag (
    name   VARCHAR(32) PRIMARY KEY
);

CREATE TABLE phototag (
    photoid  INTEGER REFERENCES photo(id) ON DELETE CASCADE NOT NULL,
    tag      VARCHAR(32) REFERENCES tag(name) ON DELETE CASCADE NOT NULL
);

CREATE TABLE event (
    id        SERIAL PRIMARY KEY,
    name      VARCHAR(64) NOT NULL,
    startdate DATE NOT NULL,
    enddate   DATE NOT NULL,
    tag       VARCHAR(32) REFERENCES tag(name) NOT NULL
);
