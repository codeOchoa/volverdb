import mysql from "mysql2/promise";
import Datastore from "nedb-promises";
import path from "path";

const dataPath = "./models";

export const usersDB = Datastore.create({
    filename: path.join(dataPath, "users.db"),
    autoload: true,
});

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

export default pool;