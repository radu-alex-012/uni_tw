DROP SCHEMA IF EXISTS db_mgmt;
CREATE SCHEMA db_mgmt;
USE db_mgmt;

CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(64) NOT NULL,
    username VARCHAR(50) NOT NULL,
    session_id VARCHAR(64) DEFAULT NULL
);

CREATE TABLE user_tables (
    user_id INT,
    db_id INT,
    PRIMARY KEY (user_id, db_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Alhamdulillah
INSERT INTO users(email, password, username) values ('r@g.com','$2b$10$qR1aJO4X/ikgy8eP2qiNceek1cqMR6PhlIif/kDSjhfbcnCwvhVdy','test12');