CREATE DATABASE users;

use users;

CREATE TABLE users (
    username VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    email    VARCHAR(255) NOT NULL,
    PRIMARY KEY (username)
);

INSERT INTO users
VALUES(
    "karina",
    "anirak",
    "karina@example.com"
);
INSERT INTO users
VALUES(
    "jacob",
    "bocaj",
    "jacob@example.com"
);
INSERT INTO users
VALUES(
    "mary",
    "yram",
    "mary@example.com"
);
INSERT INTO users
VALUES(
    "stephanie",
    "einahpets",
    "stephanie@example.com"
);
INSERT INTO users
VALUES(
    "landon",
    "nodnal",
    "landon@example.com"
);