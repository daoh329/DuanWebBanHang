const mysql = require('mysql2');

// create the connection to database
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    post: 3306,
    database: 'banhangdientu'
});

//xoa pass
module.exports = connection;