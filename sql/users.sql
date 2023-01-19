CREATE DATABASE users;

use users;

CREATE TABLE users (
    username VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    email    VARCHAR(255) NOT NULL,
    role     VARCHAR(255) NOT NULL,
    PRIMARY KEY (username)
);

INSERT INTO users
VALUES(
    "karina",
    "e764643d40048fd172c98e368c6ebdb9f56b4d48b42201929b9b5418cf96e0f6",
    "karina@orangechicken.com",
    "role1"
);
INSERT INTO users
VALUES(
    "jacob",
    "db16f771a04aceba6d7834301a822c6f8bd6df24d956cecaa7fc9e082274e539",
    "jacob@orangechicken.com",
    "role2"
);
INSERT INTO users
VALUES(
    "mary",
    "f3fd1fda00193641d4512771f9450097ac9d18ef0750677265d9142d2f3dc055",
    "mary@orangechicken.com",
    "role3"
);
INSERT INTO users
VALUES(
    "stephanie",
    "b38a4b2b6b022a9115b1b6dd112dafdd84c2df8c74dc73ac8e53a10dd380d7b9",
    "stephanie@orangechicken.com",
    "role4"
);
INSERT INTO users
VALUES(
    "landon",
    "a38b3db7cfab5b6e8ac853d3549834320b5b3314ee0b35e9a2b77aa8d784fce3",
    "landon@orangechicken.com",
    "role5"
);

CREATE TABLE logs(
    username VARCHAR(255),
    password VARCHAR(255),
    timestamp    VARCHAR(255),
    success BOOLEAN,
    PRIMARY KEY (timestamp)
);
