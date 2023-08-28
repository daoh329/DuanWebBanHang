const mysql = require("../../config/db/mySQL");
const mysql2 = require('../../config/db/mySQL');
const createOrdersTable = require("../../config/createTable");

class OrderController {
    async order(req, res){
        const data = req.body;

        if (!data) {
            return res.status(400).json("Invalid data");
        }

        // Gọi hàm createOrdersTable để tạo bảng orders nếu chưa tồn tại
        createOrdersTable();

        const query = 'INSERT INTO orders (name, avatar, price, quantity, userName, city, address, deliveryMethod, phone, note) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';


        // Thực hiện truy vấn SQL

        mysql2.query(query, [data.name, data.avatar, data.price, data.quantity, data.userName, data.city, data.address, data.deliveryMethod, data.phone, data.note], (error, results, fields) => {

    
        if (error) {
            // Trả về mã trạng thái 500 nếu có lỗi xảy ra
            res.status(500).send("Có lỗi xảy ra khi thêm thông tin cá nhân");
        } else {
            // Trả về mã trạng thái 200 nếu thêm thông tin cá nhân thành công
            res.status(200).send("Thêm thông tin cá nhân thành công");
        }
        });
    }
    async json(req, res, next) {
        
        mysql2.query('select* from orders', (err, result) => {
            if (err) {
              console.error("Lỗi truy vấn:", err);
              throw err;
            }
          
            const jsonResult = JSON.stringify(result);
            res.send(jsonResult);
          });
          
    }
}

module.exports = new OrderController;