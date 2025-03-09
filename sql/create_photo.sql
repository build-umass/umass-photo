DROP TABLE photo;
CREATE TABLE photo (
    imageId CHAR(27) PRIMARY KEY,
    userId VARCHAR(64),
    eventId INT
);
