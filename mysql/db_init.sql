DROP SCHEMA IF EXISTS db_mgmt;
CREATE SCHEMA db_mgmt;
USE db_mgmt;

CREATE TABLE users (
    email VARCHAR(255) PRIMARY KEY UNIQUE,
    password VARCHAR(64) NOT NULL,
    username VARCHAR(100) NOT NULL,
    newsletter ENUM('D','W','M') DEFAULT 'D',
    promotions ENUM('D','W','M') DEFAULT 'D'
);

CREATE TABLE user_databases (
    user_email VARCHAR(255),
    db_name VARCHAR(64),
    PRIMARY KEY (user_email, db_name),
    FOREIGN KEY (user_email) REFERENCES users(email) ON DELETE CASCADE
);

-- 123
INSERT INTO users (email, password, username)
values ('r@g.com','$2b$10$y0Y2pOQA7cDsFS60nqaCDeP2w88ft3yMhQBKl5/ZuJd7Pj5E.LXua','test12');

INSERT INTO users (email, password, username, newsletter, promotions)
VALUES ('examplpe1@example.com', 'password1', 'User1', 'D', 'W');

INSERT INTO users (email, password, username, newsletter, promotions)
VALUES ('example2@example.com', 'password2', 'User2', 'W', 'M');

INSERT INTO users (email, password, username, newsletter, promotions)
VALUES ('example3@example.com', 'password3', 'User3', 'M', 'D');

DROP SCHEMA IF EXISTS Schema1;
CREATE SCHEMA Schema1;
USE Schema1;
CREATE TABLE Table1 (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL
);
INSERT INTO Table1 (name) VALUES ('John'), ('Jane'), ('Mike');
CREATE TABLE Table2 (
    id INT PRIMARY KEY AUTO_INCREMENT,
    age INT NOT NULL,
    email VARCHAR(100) NOT NULL
);
INSERT INTO Table2 (age, email) VALUES (25, 'john@example.com'), (30, 'jane@example.com'), (35, 'mike@example.com');

DROP SCHEMA IF EXISTS Schema2;
CREATE SCHEMA Schema2;
USE Schema2;
CREATE TABLE Table1 (
    id INT PRIMARY KEY AUTO_INCREMENT,
    city VARCHAR(50) NOT NULL
);

INSERT INTO Table1 (city) VALUES ('New York'), ('London'), ('Paris');
CREATE TABLE Table2 (
    id INT PRIMARY KEY AUTO_INCREMENT,
    country VARCHAR(50) NOT NULL
);
INSERT INTO Table2 (country) VALUES ('USA'), ('UK'), ('France');

DROP SCHEMA IF EXISTS Schema3;
CREATE SCHEMA Schema3;
USE Schema3;
CREATE TABLE Table1 (
    id INT PRIMARY KEY AUTO_INCREMENT,
    product VARCHAR(50) NOT NULL,
    price DECIMAL(10, 2) NOT NULL
);
INSERT INTO Table1 (product, price) VALUES ('Apple', 1.99), ('Banana', 0.99), ('Orange', 2.49);
CREATE TABLE Table2 (
    id INT PRIMARY KEY AUTO_INCREMENT,
    category VARCHAR(50) NOT NULL
);
INSERT INTO Table2 (category) VALUES ('Electronics'), ('Clothing'), ('Books');

USE db_mgmt;

INSERT INTO user_databases (user_email, db_name)
VALUES ('r@g.com', 'Schema1');

INSERT INTO user_databases (user_email, db_name)
VALUES ('r@g.com', 'Schema2');

INSERT INTO user_databases (user_email, db_name)
VALUES ('r@g.com', 'Schema3');

INSERT INTO user_databases (user_email, db_name)
VALUES ('example2@example.com', 'Schema2');

INSERT INTO user_databases (user_email, db_name)
VALUES ('example3@example.com', 'Schema3');