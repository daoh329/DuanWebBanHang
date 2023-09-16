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

    let sql = `INSERT INTO orders (name, phone, address, email, deliveryMethod, created_at, updated_at, note, status) VALUES (?, ?, ?, ?, ?, NOW(), NOW(), ?, ?)`;
    let values = [data.userName, data.phone, data.address, data.email, data.deliveryMethod, data.note, data.status];
    mysql.query(sql, values, (err, result) => {
      if (err) throw err;
      console.log(result);
      const orderID = result.insertId; // Lấy ID của đơn hàng vừa được tạo
      sql = `INSERT INTO orderDetailsProduct (productID, quantity, orderID) VALUES (?, ?, ?)`; // Thêm dữ liệu vào bảng orderDetailsProduct
      values = [data.productID, data.quantity, orderID];
      mysql.query(sql, values, (err, result) => {
        if (err) throw err;
        console.log(result);
        sql = `UPDATE productdetails SET quantity = quantity - ? WHERE product_id = ?`; // Cập nhật số lượng sản phẩm trong bảng productdetails
        values = [data.quantity, data.productID];
        mysql.query(sql, values, (err, result) => {
          if (err) throw err;
          console.log(result);
          res.send('Order details added and product quantity updated...');
        });
      });
    });
  }

  async quanlyOrder(req, res, next) {
    const sql = `
        SELECT o.id, o.phone, o.UserID, o.Username, o.address, o.note, o.created_at, o.status, odp.quantity, p.name, p.price
        FROM orders o
        JOIN orderDetailsProduct odp ON o.id = odp.orderID
        JOIN product p ON odp.productID = p.id
        ORDER BY o.created_at DESC
    `;
    mysql.query(sql, (err, result) => {
        if (err) throw err;
        res.send(result);
    });
  }

  async confirmOrder(req, res) {
      const orderId = req.params.id;
      const sql = 'UPDATE orders SET status = 1 WHERE id = ?';

      mysql.query(sql, [orderId], (err, result) => {
          if (err) {
              console.error(err);
              res.status(500).send('Error confirming order');
          } else if (result.affectedRows === 0) {
              res.status(404).send('No order found with the provided ID');
          } else {
              res.send('Order confirmed');
          }
      });
  }

  async cancelOrder(req, res) {
      const orderId = req.params.id;
      const sql = 'UPDATE orders SET status = 0 WHERE id = ?';

      mysql.query(sql, [orderId], (err, result) => {
          if (err) {
              console.error(err);
              res.status(500).send('Error canceling order');
          } else if (result.affectedRows === 0) {
              res.status(404).send('No order found with the provided ID');
          } else {
              res.send('Order canceled');
          }
      });
  }

  async orderHistory(req, res) {
    const phone = req.params.phone;
    // Truy vấn cơ sở dữ liệu để lấy lịch sử mua hàng của người dùng có số điện thoại là phone
    const sql = `
        SELECT o.id, o.phone, o.UserID, o.Username, o.address, o.created_at, o.status, odp.quantity, p.name, p.price
        FROM orders o
        JOIN orderDetailsProduct odp ON o.id = odp.orderID
        JOIN product p ON odp.productID = p.id
        WHERE o.phone = ?
        ORDER BY o.created_at DESC
    `;
    mysql.query(sql, [phone], (err, result) => {
        if (err) throw err;
        res.send(result);
    });
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