// db.js
const mysql = require('mysql2');
require('dotenv').config({ path: '.env' }).parsed;
const pool = mysql.createPool({
    connectionLimit: 150,
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    port: process.env.MYSQL_PORT,
    multipleStatements: true,
    queueLimit: 0
});

module.exports = pool.promise();