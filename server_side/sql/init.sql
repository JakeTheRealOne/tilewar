CREATE DATABASE IF NOT EXISTS tilewar_database;
USE tilewar_database;

-- Users of the website
CREATE TABLE IF NOT EXISTS Users (
    email VARCHAR(100) NOT NULL UNIQUE,
    pw VARCHAR(100) NOT NULL,
    PRIMARY KEY (email)
) ENGINE=InnoDB;

-- Categories
CREATE TABLE IF NOT EXISTS Categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    author_email VARCHAR(100) NOT NULL,
    title VARCHAR(100) NOT NULL,
    creation_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (author_email) REFERENCES Users(email) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Tiles
CREATE TABLE IF NOT EXISTS Tiles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    author_email VARCHAR(100) NOT NULL,
    cat_id INT NOT NULL,
    title VARCHAR(100) NOT NULL,
    content VARCHAR(1000) NOT NULL,
    creation_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (author_email) REFERENCES Users(email) ON DELETE CASCADE,
    FOREIGN KEY (cat_id) REFERENCES Categories(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Timestamps (polling)
CREATE TABLE IF NOT EXISTS LastTimestamps (
    table_name VARCHAR(100) NOT NULL UNIQUE,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (table_name)
) ENGINE=InnoDB;

-- DONNÉES INITIALES 
-- 1. Créer un utilisateur admin
INSERT IGNORE INTO Users (email, pw) VALUES ('admin@test.com', '123');

-- 2. Créer catégories avec l'utilisateur admin
INSERT IGNORE INTO Categories (author_email, title) VALUES 
('admin@test.com', 'Études'),
('admin@test.com', 'Travail'),
('admin@test.com', 'Maison'),
('admin@test.com', 'Loisirs');

-- 3. Timestamps
INSERT IGNORE INTO LastTimestamps (table_name) VALUES ("Users");
INSERT IGNORE INTO LastTimestamps (table_name) VALUES ("Categories");
INSERT IGNORE INTO LastTimestamps (table_name) VALUES ("Tiles");

-- Admin MySQL
CREATE USER IF NOT EXISTS 'admin'@'localhost' IDENTIFIED BY '123';
GRANT ALL PRIVILEGES ON tilewar_database.* TO 'admin'@'localhost';
FLUSH PRIVILEGES;

-- verif
SELECT 'Setup complet!' as message;
SELECT COUNT(*) as users FROM Users;
SELECT COUNT(*) as categories FROM Categories;
SELECT COUNT(*) as tiles FROM Tiles;
