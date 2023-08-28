const mysql = require('mysql2');

// create the connection to database
const connection = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    post: 3306,
    password: 'Huyhoang456123!',
    database: 'banhangdientu'
});

module.exports = connection;