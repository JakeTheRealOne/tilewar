CREATE DATABASE IF NOT EXISTS tilewar_database;
USE tilewar_database;

-- Users of the website
CREATE TABLE IF NOT EXISTS Users (
    email VARCHAR(100) NOT NULL UNIQUE,
    pw VARCHAR(100) NOT NULL,
    PRIMARY KEY (email)
);

-- Categories
CREATE TABLE IF NOT EXISTS Categories (
    id INT AUTO_INCREMENT UNIQUE,
    author_email VARCHAR(100) NOT NULL,
    title VARCHAR(100) NOT NULL,
    creation_date DATETIME NOT NULL DEFAULT (NOW()),
    PRIMARY KEY (id),
    FOREIGN KEY (author_email) REFERENCES Users(email) ON DELETE CASCADE
);

-- Tiles
CREATE TABLE IF NOT EXISTS Tiles (
    id INT AUTO_INCREMENT UNIQUE,
    author_email VARCHAR(100) NOT NULL,
    cat_id INT NOT NULL,
    title VARCHAR(100) NOT NULL,
    content VARCHAR(1000) NOT NULL,
    creation_date DATETIME NOT NULL DEFAULT (NOW()),
    PRIMARY KEY (id),
    FOREIGN KEY (author_email) REFERENCES Users(email) ON DELETE CASCADE,
    FOREIGN KEY (cat_id) REFERENCES Categories(id) ON DELETE CASCADE
);


-- Timestamps (polling)
CREATE TABLE IF NOT EXISTS LastTimestamps (
    table_name VARCHAR(100) NOT NULL UNIQUE,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (table_name)
);

-- Set a default timestamp for all three tables
INSERT INTO LastTimestamps (table_name) VALUES ("Users");
INSERT INTO LastTimestamps (table_name) VALUES ("Categories");
INSERT INTO LastTimestamps (table_name) VALUES ("Tiles");

-- Create admin
CREATE USER 'admin'@'localhost' IDENTIFIED BY 'ift3225';
GRANT ALL PRIVILEGES ON tilewar_database.* TO 'admin'@'localhost';
FLUSH PRIVILEGES;