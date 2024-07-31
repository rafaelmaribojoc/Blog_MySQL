const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'Th!s3mb3r@23',
    database: 'blog',
});

module.exports = pool; 