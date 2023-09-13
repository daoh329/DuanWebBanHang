const mysql = require("../../config/db/mySQL");
const { da } = require("date-fns/locale");

class OrderController {
  // API /order/order
  async order(req, res) {
    const data = req.body;
    console.log(data);

    if (!data) {
      return res.status(400).json("Invalid data");
    }

    // const query =
    //   "INSERT INTO orders (name, avatar, price, quantity, userName, city, selectedCity, selectedDistrict, address, deliveryMethod, phone, note, status ,created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    // const query =
    //   "INSERT INTO orders (name, avatar, price, quantity, userName, city, selectedCity, selectedDistrict, address, deliveryMethod, phone, note, status ,created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

    // // Thực hiện truy vấn SQL

    // mysql.query(
    //   query,
    //   [
    //     data.name,
    //     data.avatar,
    //     data.price,
    //     data.quantity,
    //     data.userName,
    //     data.city,
    //     data.selectedCity,
    //     data.selectedDistrict,
    //     data.address,
    //     data.deliveryMethod,
    //     data.phone,
    //     data.note,
    //     data.status,
    //     new Date(),
    //   ],
    //   (error, results, fields) => {
    //     if (error) {
    //       // Trả về mã trạng thái 500 nếu có lỗi xảy ra
    //       res.status(500).send("Có lỗi xảy ra khi thêm thông tin cá nhân");
    //     } else {
    //       // Trả về mã trạng thái 200 nếu thêm thông tin cá nhân thành công
    //       res.status(200).send("Thêm thông tin cá nhân thành công");
    //     }
    //   }
    // );
    const sql = `INSERT INTO orders (name, phone, address, email, deliveryMethod, created_at, updated_at, note, status) VALUES (?, ?, ?, ?, ?, NOW(), NOW(), ?, ?)`;
    const values = [data.userName, data.phone, data.address, data.email, data.deliveryMethod, data.note, data.status];
    mysql.query(sql, values, (err, result) => {
      if (err) throw err;
      console.log(result);
      const orderID = result.insertId; // Lấy ID của đơn hàng vừa được tạo
      sql = `INSERT INTO orderDetailsProduct (productID, quantity, orderID) VALUES (?, ?, ?)`; // Thêm dữ liệu vào bảng orderDetailsProduct
      values = [data.productID, data.quantity, orderID];
      mysql.query(sql, values, (err, result) => {
        if (err) throw err;
        console.log(result);
        res.send('Order details added...');
      });
    });
  }

  async json(req, res, next) {
    // Thực hiện truy vấn SELECT để lấy dữ liệu từ bảng
    mysql.query("SELECT * FROM orders", (err, result) => {
      if (err) throw err;

      // Chuyển đổi kết quả truy vấn thành chuỗi JSON
      const jsonResult = JSON.stringify(result);

      // Gửi chuỗi JSON về cho client
      res.send(jsonResult);
    });
  }

  async confirmOrder(req, res) {
    console.log("Confirm order request received");
    const orderId = req.params.id;
    // Thực hiện truy vấn SQL để cập nhật trạng thái đơn hàng thành 'Đã xác nhận'
    const updateQuery = "UPDATE orders SET status = ? WHERE id = ?";
    mysql.query(
      updateQuery,
      ["Đã xác nhận", orderId],
      (error, results, fields) => {
        if (error) {
          console.error("Error updating order status:", error);
          res
            .status(500)
            .send("Có lỗi xảy ra khi cập nhật trạng thái đơn hàng");
        } else {
          res.status(200).send("Cập nhật trạng thái đơn hàng thành công");
        }
      }
    );
  }

  async cancelOrder(req, res) {
    const orderId = req.params.id;
    // Thực hiện truy vấn SQL để cập nhật trạng thái đơn hàng thành 'Đã hủy'
    const updateQuery = "UPDATE orders SET status = ? WHERE id = ?";
    mysql.query(updateQuery, ["Đã hủy", orderId], (error, results, fields) => {
      if (error) {
        console.error("Error updating order status:", error);
        res.status(500).send("Có lỗi xảy ra khi cập nhật trạng thái đơn hàng");
      } else {
        res.status(200).send("Cập nhật trạng thái đơn hàng thành công");
      }
    });
  }

  async orderHistory(req, res) {
    const phone = req.params.phone;
    // Truy vấn cơ sở dữ liệu để lấy lịch sử mua hàng của người dùng có số điện thoại là phone
    mysql.query(
      "SELECT * FROM orders WHERE phone = ?",
      [phone],
      (error, results, fields) => {
        if (error) throw error;
        res.send(results);
        console.log(results);
      }
    );
  }

  async topLaptop(req, res) {
    const query = `SELECT name, avatar, price, created_at, COUNT(*)
    FROM orders
    WHERE created_at >= DATE_ADD(CURDATE(), INTERVAL -1 MONTH)
    GROUP BY name, avatar, price, created_at
    ORDER BY COUNT(*) DESC
    LIMIT 5;      
    `;
    mysql.query(query, (error, results) => {
      if (error) {
        res.status(500).send(error);
      } else {
        res.send(results);
      }
    });
  }
  
}

module.exports = new OrderController();