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

-- Initial content
INSERT INTO Users (email, pw) VALUES ('admin@diro.umontreal.ca', 'ift3225');
