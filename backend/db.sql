INSERT INTO users (username, password, role)
VALUES ('admin', '$2b$10$J9tTiomG2i55oW5l0L0fXekyixOYEApIx/oR6HQ1PgDHcVwlMeyae',
'admin');


CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'user' 
);
ALTER TABLE users
ADD CONSTRAINT role_check
CHECK (role IN ('admin', 'auditor', 'register'));

CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    code VARCHAR(20),
    name VARCHAR(100),
    description VARCHAR(256),
    quantity INTEGER,
    price NUMERIC(10,2)
);