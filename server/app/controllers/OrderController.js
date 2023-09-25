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

    let sql = `INSERT INTO orders (nameOrder, phone, address, email, deliveryMethod, created_at, updated_at, note, status) VALUES (?, ?, ?, ?, ?, NOW(), NOW(), ?, ?)`;
    let values = [data.name, data.phone, data.address, data.email, data.deliveryMethod, data.note, data.status];
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
        SELECT o.id, o.phone, o.UserID, o.nameOrder, o.address, o.note, o.created_at, o.status, odp.quantity, p*
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
    const sql = 'UPDATE orders SET status = 1, updated_at = NOW() WHERE id = ?';
    
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
      const sql = 'UPDATE orders SET status = 2, updated_at = NOW() WHERE id = ?';

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
        SELECT o.id, o.phone, o.UserID, o.nameOrder, o.address, o.created_at, o.status, odp.quantity, p.*
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
    const query = `
      SELECT product*, MAX(productDetails.brand) as brand, galery.thumbnail
      FROM product
      JOIN productDetails ON product.id = productDetails.product_id
      JOIN (
          SELECT id, thumbnail, product_id
          FROM (
            SELECT id, thumbnail, product_id,
                  ROW_NUMBER() OVER(PARTITION BY product_id ORDER BY id) as rn
            FROM galery
          ) tmp
          WHERE rn = 1
      ) galery ON product.id = galery.product_id
      JOIN orderDetailsProduct ON product.id = orderDetailsProduct.productID
      JOIN orders ON orderDetailsProduct.orderID = orders.id
      WHERE orders.created_at >= DATE_SUB(NOW(), INTERVAL 5 MONTH)
      GROUP BY product.id, galery.thumbnail
      ORDER BY SUM(orderDetailsProduct.quantity) DESC
      LIMIT 10;
      `;

      mysql.query(query, (error, results) => {
        if (error) {
          return res.json({ error });
        }
    
        res.json(results);
      });
  }
  
  async dashboard(req, res) {
    let sql = "SELECT status, UNIX_TIMESTAMP(CONVERT_TZ(updated_at, '+00:00', '+07:00')) as updated_date, COUNT(*) as count FROM orders GROUP BY status, UNIX_TIMESTAMP(CONVERT_TZ(updated_at, '+00:00', '+07:00'))";
    mysql.query(sql, (err, result) => {
      if(err) throw err;
      
      // Chuyển đổi dữ liệu
      const convertedData = result.reduce((acc, item) => {
        const dateExists = acc.find(data => data.updated_date === item.updated_date);
        
        if(dateExists){
          switch(item.status) {
            case 0:
              dateExists.unconfirm = item.count;
              break;
            case 1:
              dateExists.confirm = item.count;
              break;
            case 2:
              dateExists.cancel = item.count;
              break;
          }
        } else {
          let newItem = {updated_date: item.updated_date};
          switch(item.status) {
            case 0:
              newItem.unconfirm = item.count;
              break;
            case 1:
              newItem.confirm = item.count;
              break;
            case 2:
              newItem.cancel = item.count;
              break;
          }
          acc.push(newItem);
        }
        
        return acc;
      }, []);
  
      res.send(convertedData);
    });
  }
}

module.exports = new OrderController();