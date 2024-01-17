create table users
(
    id       INTEGER primary key autoincrement,
    username TEXT,
    password TEXT,
    role     TEXT default 'USER'
);
