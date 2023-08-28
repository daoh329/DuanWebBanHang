const mysql = require('mysql2');

// create the connection to database
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    post: 3306,
    // password: '123456',
    // database: 'banhangdientu'
});


module.exports = connection;