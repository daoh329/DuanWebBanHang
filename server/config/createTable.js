const mysql = require("../config/db/mySQL");

const createOrdersTable = () => {
    const createTableQuery = `CREATE TABLE IF NOT EXISTS orders (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255),
      avatar VARCHAR(255),
      price FLOAT,
      quantity INT,
      city VARCHAR(255),
      address VARCHAR(255),
      deliveryMethod VARCHAR(255),
      phone VARCHAR(255),
      note TEXT
    )`;
  
    mysql.query(createTableQuery, (error, results, fields) => {
      if (error) {
        // Xử lý lỗi
        console.error(error);
      } else {
        // Bảng orders đã được tạo hoặc đã tồn tại
        console.log('Bảng orders đã được tạo hoặc đã tồn tại');
      }
    });
  };
  
  module.exports = createOrdersTable;