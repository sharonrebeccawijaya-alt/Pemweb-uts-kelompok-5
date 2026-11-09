require('dotenv').config();

const mysql = require('mysql2/promise');

const db = mysql.createPool({
    host: process.env.DB_HOST || '127.0.0.1',
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'stockflow',

    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

async function testConnection() {
    let connection;

    try {
        console.log('================================');
        console.log('STOCKFLOW DATABASE CONNECTION');
        console.log('================================');

        connection = await db.getConnection();

        const [rows] = await connection.query(
            'SELECT DATABASE() AS database_name, VERSION() AS mysql_version'
        );

        console.log('Status: CONNECTED');
        console.log('Database:', rows[0].database_name);
        console.log('MySQL Version:', rows[0].mysql_version);

    } catch (error) {
        console.error('Database connection failed!');
        console.error('Error code:', error.code);
        console.error('Error message:', error.message);

        throw error;

    } finally {
        if (connection) {
            connection.release();
        }
    }
}

module.exports = {
    db,
    testConnection
};