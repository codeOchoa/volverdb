import mysql from "mysql2/promise";

if (!process.env.DB_HOST || !process.env.DB_USER || !process.env.DB_NAME) {
    throw new Error("❌ ERROR: Faltan variables de entorno MySQL. Revisá tu archivo .env");
}

export const pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT ?? 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,

    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,

    enableKeepAlive: true,
    keepAliveInitialDelay: 0,
});

export async function query(sql, params = []) {
    const [rows] = await pool.execute(sql, params);
    return rows;
}

export default pool;
