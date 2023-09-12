const mysql = require('mysql2');

// create the connection to database
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: process.env.PASS_MYSQL,
    database: 'banhangdientu'
});

// Kết nối tới cơ sở dữ liệu
connection.connect((err) => {
    if (err) {
        console.error("Lỗi kết nối:", err);
    } else {
        console.log("Kết nối thành công đến MySQL");
    }
  });


module.exports = connection;