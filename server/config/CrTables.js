const mysql = require("./db/mySQL");

class createTable {
    async Laptop() {
        const createTableQuery = `CREATE TABLE laptop (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255),
            price INT,
            quantity INT,
            brand VARCHAR(255),
            series VARCHAR(255),
            CPU VARCHAR(255),
            GPU VARCHAR(255),
            VGA VARCHAR(255),
            ram INT,
            Screen_size VARCHAR(255),
            Screen_resolution VARCHAR(255),
            OS VARCHAR(255),
            mass INT,
            Production_Date DATE,
            Entry_Date DATE,
            status ENUM('available', 'out of stock', 'discontinued')
          );`;

        mysql.query(createTableQuery, (error, results, fields) => {
            if (error) {
                // Xử lý lỗi
                console.error(error);
            } else {
                // Bảng orders đã được tạo hoặc đã tồn tại
                console.log('Bảng Laptop đã được tạo hoặc đã tồn tại');
            }
        });
    };
    async image_url() {
        const createTableQuery = `CREATE TABLE image_url (
        id INT AUTO_INCREMENT PRIMARY KEY,
        image_url VARCHAR(255),
        laptop_id INT NOT NULL,
        FOREIGN KEY (laptop_id) REFERENCES laptop (id)
      );`;

        mysql.query(createTableQuery, (error, results, fields) => {
            if (error) {
                // Xử lý lỗi
                console.error(error);
            } else {
                // Bảng orders đã được tạo hoặc đã tồn tại
                console.log('Bảng image_url đã được tạo hoặc đã tồn tại');
            }
        });
    };

}

module.exports = new createTable;