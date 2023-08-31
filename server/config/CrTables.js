const mysql = require("./db/mySQL");

class CreateTable{
        async createLaptopTable(){
        const createTableQuery = `CREATE TABLE IF NOT EXISTS laptop (
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
            color VARCHAR(255),
            warranty VARCHAR(255),
            status ENUM('available', 'out of stock', 'discontinued')
          );`;

        mysql.query(createTableQuery, (error, results, fields) => {
            if (error) {
                console.error(error);
            } else {
                console.log('Bảng Laptop đã được tạo hoặc đã tồn tại');
            }
        });
    }

    async createPhoneTable() {
        const createTableQuery = `CREATE TABLE IF NOT EXISTS phone (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255),
            price INT,
            ram INT,
            rom INT,
            brand VARCHAR(255),
            color VARCHAR(255),
            series VARCHAR(255),
            OS VARCHAR(255),
            fast_charging VARCHAR(255),
            camera_main VARCHAR(255),
            camera_selfie VARCHAR(255),
            screen VARCHAR(255),
            battery_life VARCHAR(255),
            Chip VARCHAR(255),
            quantity INT,
            Entry_Date DATE,
            warranty VARCHAR(255),
            status ENUM('available', 'out of stock', 'discontinued')
          );`;

        mysql.query(createTableQuery, (error, results, fields) => {
            if (error) {
                console.error(error);
            } else {
                console.log('Bảng Phone đã được tạo hoặc đã tồn tại');
            }
        });
    }

    async createImageUrlTable() {
        const createTableQuery = `CREATE TABLE IF NOT EXISTS image_url (
            id INT AUTO_INCREMENT PRIMARY KEY,
            image_url VARCHAR(255),
            laptop_id INT,
            phone_id INT,
            FOREIGN KEY (laptop_id) REFERENCES laptop(id),
            FOREIGN KEY (phone_id) REFERENCES phone(id)
          );`;

        mysql.query(createTableQuery, (error, results, fields) => {
            if (error) {
                console.error(error);
            } else {
                console.log('Bảng image_url đã được tạo hoặc đã tồn tại');
            }
        });
    }
}

module.exports = new CreateTable;
