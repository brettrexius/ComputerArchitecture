-- clean entry every time for testing purpose
SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS Messages;
DROP TABLE IF EXISTS UserChat;
DROP TABLE IF EXISTS Friendship;
DROP TABLE IF EXISTS FriendRequests;
DROP TABLE IF EXISTS Chats;
DROP TABLE IF EXISTS Users;
SET FOREIGN_KEY_CHECKS = 1;

-- a table to store users
CREATE TABLE Users (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    avatarId INT NOT NULL DEFAULT 0,
    username VARCHAR(255) NOT NULL UNIQUE, 
    password VARCHAR(255) NOT NULL,
    firstname VARCHAR(255) NOT NULL,
    lastname VARCHAR(255) NOT NULL,
    email VARCHAR(255) DEFAULT(NULL),
    description TEXT
);

-- a table to store chats
CREATE TABLE Chats (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255),
    owner INT NOT NULL,
    description TEXT,
    is_DM INT DEFAULT 1,
    FOREIGN KEY (owner) REFERENCES Users(id)
);

-- a table to store frend requests
CREATE TABLE FriendRequests (
    uid1 INT NOT NULL,
    uid2 INT NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (uid1, uid2),
    FOREIGN KEY (uid1) REFERENCES Users(id),
    FOREIGN KEY (uid2) REFERENCES Users(id)
);

-- a table to store friendship between users
CREATE TABLE Friendship (
    uid1 INT NOT NULL,
    uid2 INT NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (uid1, uid2),
    FOREIGN KEY (uid1) REFERENCES Users(id),
    FOREIGN KEY (uid2) REFERENCES Users(id)
);

-- a table to track which user belongs to which chat
CREATE TABLE UserChat (
    uid INT NOT NULL,
    cid INT NOT NULL,
    PRIMARY KEY (uid, cid),
    FOREIGN KEY (uid) REFERENCES Users(id),
    FOREIGN KEY (cid) REFERENCES Chats(id)
);

-- a table to store messages
CREATE TABLE Messages (
    uid INT NOT NULL,
    cid INT NOT NULL,
    message TEXT NOT NULL,
    timestamp DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (uid, cid, timestamp),
    FOREIGN KEY (uid) REFERENCES Users(id),
    FOREIGN KEY (cid) REFERENCES Chats(id)
);

INSERT INTO Users(username, password, firstname, lastname, email) VALUES('admin', 'admin', 'Mr.', 'Admin', 'admin@smartchat.com');
INSERT INTO Users(username, password, firstname, lastname, email) VALUES('root', 'root', 'Mr.', 'Root', 'root@smartchatmcom');
INSERT INTO Users(username, password, firstname, lastname, email) VALUES('superman', 'superman', 'Super', 'Man', 'superman@gmail.com');
-- INSERT INTO Users(username, password, firstname, lastname, email) VALUES('jackychan', 'jackychan', 'Jacky', 'Chan', 'jackychan@gmail.com');