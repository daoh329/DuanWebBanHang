const mysql = require("../../config/db/mySQL");
const mysql2 = require('../../config/db/mySQL');
const createOrdersTable = require("../../config/createTable");

class OrderController {
    async order(req, res) {
        const data = req.body;

        if (!data) {
            return res.status(400).json("Invalid data");
        }

        // Gọi hàm createOrdersTable để tạo bảng orders nếu chưa tồn tại
        createOrdersTable();

        const query = 'INSERT INTO orders (name, avatar, price, quantity, userName, city, address, deliveryMethod, phone, note, status ,created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';



        // Thực hiện truy vấn SQL

        mysql.query(query, [data.name, data.avatar, data.price, data.quantity, data.userName, data.city, data.address, data.deliveryMethod, data.phone, data.note, data.status, new Date()], (error, results, fields) => {


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
        // Thực hiện truy vấn SELECT để lấy dữ liệu từ bảng
        mysql.query('SELECT * FROM orders', (err, result) => {
            if (err) throw err;

            // Chuyển đổi kết quả truy vấn thành chuỗi JSON
            const jsonResult = JSON.stringify(result);

            // Gửi chuỗi JSON về cho client
            res.send(jsonResult);
        });
    }
    async confirmOrder(req, res) {
        console.log('Confirm order request received');
        const orderId = req.params.id;
        // Thực hiện truy vấn SQL để cập nhật trạng thái đơn hàng thành 'Đã xác nhận'
        const updateQuery = 'UPDATE orders SET status = ? WHERE id = ?';
        mysql.query(updateQuery, ['Đã xác nhận', orderId], (error, results, fields) => {
            if (error) {
                console.error("Error updating order status:", error);
                res.status(500).send("Có lỗi xảy ra khi cập nhật trạng thái đơn hàng");
            } else {
                res.status(200).send("Cập nhật trạng thái đơn hàng thành công");
            }
        });
    }

    async cancelOrder(req, res) {
        const orderId = req.params.id;
        // Thực hiện truy vấn SQL để cập nhật trạng thái đơn hàng thành 'Đã hủy'
        const updateQuery = 'UPDATE orders SET status = ? WHERE id = ?';
        mysql.query(updateQuery, ['Đã hủy', orderId], (error, results, fields) => {
            if (error) {
                console.error("Error updating order status:", error);
                res.status(500).send("Có lỗi xảy ra khi cập nhật trạng thái đơn hàng");
            } else {
                res.status(200).send("Cập nhật trạng thái đơn hàng thành công");
            }
        });
    }
}

module.exports = new OrderController;