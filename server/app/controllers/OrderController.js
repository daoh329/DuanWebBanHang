const mysql = require("../../config/db/mySQL");
const createOrdersTable = require("../../config/createTable");

class OrderController {
    async order(req, res){
        const data = req.body;

        if (!data) {
            return res.status(400).json("Invalid data");
        }

        // Gọi hàm createOrdersTable để tạo bảng orders nếu chưa tồn tại
        createOrdersTable();

        const query = 'INSERT INTO orders (name, avatar, price, quantity, city, address, deliveryMethod, phone, note) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';

        // Thực hiện truy vấn SQL
        mysql.query(query, [data.name, data.avatar, data.price, data.quantity, data.city, data.address, data.deliveryMethod, data.phone, data.note], (error, results, fields) => {
        if (error) {
            // Trả về mã trạng thái 500 nếu có lỗi xảy ra
            res.status(500).send("Có lỗi xảy ra khi thêm thông tin cá nhân");
        } else {
            // Trả về mã trạng thái 200 nếu thêm thông tin cá nhân thành công
            res.status(200).send("Thêm thông tin cá nhân thành công");
        }
        });
    }
}

module.exports = new OrderController;