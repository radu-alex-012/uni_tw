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

-- Alhamdulillah
INSERT INTO users (email, password, username)
values ('r@g.com','$2b$10$qR1aJO4X/ikgy8eP2qiNceek1cqMR6PhlIif/kDSjhfbcnCwvhVdy','test12');

INSERT INTO users (email, password, username, newsletter, promotions)
VALUES ('example1@example.com', 'password1', 'User1', 'D', 'W');

INSERT INTO users (email, password, username, newsletter, promotions)
VALUES ('example2@example.com', 'password2', 'User2', 'W', 'M');

INSERT INTO users (email, password, username, newsletter, promotions)
VALUES ('example3@example.com', 'password3', 'User3', 'M', 'D');

-- Create Schema1
DROP SCHEMA IF EXISTS Schema1;
CREATE SCHEMA Schema1;
USE Schema1;

-- Create Table1 in Schema1
CREATE TABLE Table1 (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL
);

-- Insert data into Table1
INSERT INTO Table1 (name) VALUES ('John'), ('Jane'), ('Mike');

-- Create Table2 in Schema1
CREATE TABLE Table2 (
    id INT PRIMARY KEY AUTO_INCREMENT,
    age INT NOT NULL,
    email VARCHAR(100) NOT NULL
);

-- Insert data into Table2
INSERT INTO Table2 (age, email) VALUES (25, 'john@example.com'), (30, 'jane@example.com'), (35, 'mike@example.com');


-- Create Schema2
DROP SCHEMA IF EXISTS Schema2;
CREATE SCHEMA Schema2;
USE Schema2;

-- Create Table1 in Schema2
CREATE TABLE Table1 (
    id INT PRIMARY KEY AUTO_INCREMENT,
    city VARCHAR(50) NOT NULL
);

-- Insert data into Table1
INSERT INTO Table1 (city) VALUES ('New York'), ('London'), ('Paris');

-- Create Table2 in Schema2
CREATE TABLE Table2 (
    id INT PRIMARY KEY AUTO_INCREMENT,
    country VARCHAR(50) NOT NULL
);

-- Insert data into Table2
INSERT INTO Table2 (country) VALUES ('USA'), ('UK'), ('France');


-- Create Schema3
DROP SCHEMA IF EXISTS Schema3;
CREATE SCHEMA Schema3;
USE Schema3;

-- Create Table1 in Schema3
CREATE TABLE Table1 (
    id INT PRIMARY KEY AUTO_INCREMENT,
    product VARCHAR(50) NOT NULL,
    price DECIMAL(10, 2) NOT NULL
);

-- Insert data into Table1
INSERT INTO Table1 (product, price) VALUES ('Apple', 1.99), ('Banana', 0.99), ('Orange', 2.49);

-- Create Table2 in Schema3
CREATE TABLE Table2 (
    id INT PRIMARY KEY AUTO_INCREMENT,
    category VARCHAR(50) NOT NULL
);

-- Insert data into Table2
INSERT INTO Table2 (category) VALUES ('Electronics'), ('Clothing'), ('Books');

-- --------------------------
USE db_mgmt;

INSERT INTO user_databases (user_email, db_name)
VALUES ('example1@example.com', 'Schema1');

INSERT INTO user_databases (user_email, db_name)
VALUES ('example2@example.com', 'Schema2');

INSERT INTO user_databases (user_email, db_name)
VALUES ('example3@example.com', 'Schema3');

SELECT table_name FROM information_schema.tables where table_schema='db_mgmt';
SELECT db_name from user_databases where user_email='example1@example.com';