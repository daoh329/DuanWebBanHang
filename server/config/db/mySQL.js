const mysql = require('mysql2');
require('dotenv').config();

// create the connection to database
const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    port:process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    timezone: process.env.TIME_ZONE,
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