const mysql = require("../../config/db/mySQL");
const { da } = require("date-fns/locale");

class OrderController {
  // API /order/order
  async order(req, res) {
    const data = req.body;
    // console.log(data);
  
    if (!data) {
      return res.status(400).json("Invalid data");
    }
  
    // Kiểm tra số lượng sản phẩm hiện có
    let sql = `SELECT quantity FROM productdetails WHERE product_id = ?`;
    let values = [data.productID];
    mysql.query(sql, values, (err, result) => {
      if (err) throw err;
      // console.log(result);
  
      // Nếu số lượng mua hàng nhiều hơn số lượng sản phẩm hiện có
      if (data.quantity > result[0].quantity) {
        return res.status(400).json("Số lượng sản phẩm không đủ");
      }
  
      // Nếu số lượng mua hàng không vượt quá số lượng sản phẩm hiện có
      sql = `INSERT INTO orders (UserID,addressID, deliveryMethod, paymentMenthod, created_at, updated_at, note, status) VALUES (?,?, ?, ?, NOW(), NOW(), ?, ?)`;
      values = [data.UserID, data.addressID, data.deliveryMethod, data.paymentMenthod, data.note, data.status];
      mysql.query(sql, values, (err, result) => {
        if (err) throw err;
        // console.log(result);
        const orderID = result.insertId; // Lấy ID của đơn hàng vừa được tạo
        sql = `INSERT INTO orderDetailsProduct (productID, quantity, orderID) VALUES (?, ?, ?)`; // Thêm dữ liệu vào bảng orderDetailsProduct
        values = [data.productID, data.quantity, orderID];
        mysql.query(sql, values, (err, result) => {
          if (err) throw err;
          // console.log(result);
          res.send('Order details added...');
        });
      });
    });
  }
  
  

  async quanlyOrder(req, res, next) {
    const sql = `
      SELECT o.id AS order_id, o.deliveryMethod, o.paymentMenthod, CONVERT_TZ(o.created_at, '+00:00', '+07:00') AS order_created_at, CONVERT_TZ(o.updated_at, '+00:00', '+07:00') AS order_updated_at, o.note AS order_note, o.status AS order_status, o.addressID,
      u.id AS user_id, u.name AS user_name, u.phone AS user_phone, u.email AS user_email, da.email AS delivery_email, da.phone AS delivery_phone,
      CONCAT(da.city, ', ', da.District, ', ', da.Commune, ', ', da.Street) AS address,
      odp.*, p.*
      FROM orders o
      JOIN users u ON o.UserID = u.id
      JOIN delivery_address da ON o.addressID = da.id
      JOIN orderDetailsProduct odp ON o.id = odp.orderID
      JOIN product p ON odp.productID = p.id
      WHERE o.created_at >= DATE_SUB(NOW(), INTERVAL 1 MONTH)
      ORDER BY o.created_at DESC
    `;
    mysql.query(sql, (err, result) => {
        if (err) throw err;
        res.send(result);
    });
  }

  async quanlyAllOrder(req, res, next) {
    const sql = `
      SELECT o.id AS order_id, o.deliveryMethod, o.paymentMenthod, CONVERT_TZ(o.created_at, '+00:00', '+07:00') AS order_created_at, CONVERT_TZ(o.updated_at, '+00:00', '+07:00') AS order_updated_at, o.note AS order_note, o.status AS order_status, o.addressID,
      u.id AS user_id, u.name AS user_name, u.phone AS user_phone, u.email AS user_email, da.email AS delivery_email, da.phone AS delivery_phone,
      CONCAT(da.city, ', ', da.District, ', ', da.Commune, ', ', da.Street) AS address,
      odp.*, p.*
      FROM orders o
      JOIN users u ON o.UserID = u.id
      JOIN delivery_address da ON o.addressID = da.id
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
            // console.error(err);
            res.status(500).send('Error confirming order');
        } else if (result.affectedRows === 0) {
            res.status(404).send('No order found with the provided ID');
        } else {
            res.send('Order confirmed...');
        }
    });
  }

  async cancel(req, res) {
    const orderId = req.params.id;
    const sql = 'UPDATE orders SET status = 2, updated_at = NOW() WHERE id = ?';
    
    mysql.query(sql, [orderId], (err, result) => {
        if (err) {
            // console.error(err);
            res.status(500).send('Error canceling order');
        } else if (result.affectedRows === 0) {
            res.status(404).send('No order found with the provided ID');
        } else {
            res.send('Order canceled...');
        }
    });
  }

  async shippingOrder(req, res) {
    const orderId = req.params.id;
    const sql = 'UPDATE orders SET status = 3, updated_at = NOW() WHERE id = ?';
    
    mysql.query(sql, [orderId], (err, result) => {
        if (err) {
            // console.error(err);
            res.status(500).send('Error confirming order');
        } else if (result.affectedRows === 0) {
            res.status(404).send('No order found with the provided ID');
        } else {
          res.send('Order delivered...');
        }
    });
  }

  async deliveredOrder(req, res) {
    const orderId = req.params.id;
    const sql = 'UPDATE orders SET status = 4, updated_at = NOW() WHERE id = ?';
    
    mysql.query(sql, [orderId], (err, result) => {
        if (err) {
            // console.error(err);
            res.status(500).send('Error confirming order');
        } else if (result.affectedRows === 0) {
            res.status(404).send('No order found with the provided ID');
        } else {
          // Lấy thông tin về số lượng sản phẩm trong đơn hàng từ bảng orderDetailsProduct
          let sql = `SELECT productID, quantity FROM orderDetailsProduct WHERE orderID = ?`;
          let values = [orderId];
          mysql.query(sql, values, (err, orderDetails) => {
            if (err) throw err;

            // Duyệt qua từng sản phẩm trong đơn hàng
            for (let i = 0; i < orderDetails.length; i++) {
              const productID = orderDetails[i].productID;
              const quantity = orderDetails[i].quantity;

              // Cập nhật số lượng sản phẩm trong bảng productDetails
              sql = `UPDATE productDetails SET quantity = quantity - ? WHERE product_id = ?`;
              values = [quantity, productID];
              mysql.query(sql, values, (err, result) => {
                if (err) throw err;
                // console.log(result);
              });
            }

            res.send('Order delivered and product quantity updated...');
          });
        }
    });
  }

  async deliveryfailedOrder(req, res) {
    const orderId = req.params.id;
    const sql = 'UPDATE orders SET status = 5, updated_at = NOW() WHERE id = ?';
    
    mysql.query(sql, [orderId], (err, result) => {
        if (err) {
            // console.error(err);
            res.status(500).send('Error confirming order');
        } else if (result.affectedRows === 0) {
            res.status(404).send('No order found with the provided ID');
        } else {
          // Lấy thông tin về số lượng sản phẩm trong đơn hàng từ bảng orderDetailsProduct
          let sql = `SELECT productID, quantity FROM orderDetailsProduct WHERE orderID = ?`;
          let values = [orderId];
          mysql.query(sql, values, (err, orderDetails) => {
            if (err) throw err;

            // Duyệt qua từng sản phẩm trong đơn hàng
            for (let i = 0; i < orderDetails.length; i++) {
              const productID = orderDetails[i].productID;
              const quantity = orderDetails[i].quantity;

              // Cập nhật số lượng sản phẩm trong bảng productDetails
              sql = `UPDATE productDetails SET quantity = quantity + ? WHERE product_id = ?`;
              values = [quantity, productID];
              mysql.query(sql, values, (err, result) => {
                if (err) throw err;
                // console.log(result);
              });
            }
            res.send('Order canceled and product quantity updated...');
          });
        }
    });
  }

  async buyback(req, res) {
    const orderId = req.params.id;
    const sql = 'UPDATE orders SET status = 0, updated_at = NOW(), created_at = NOW() WHERE id = ?';
    
    mysql.query(sql, [orderId], (err, result) => {
        if (err) {
            // console.error(err);
            res.status(500).send('Error confirming order');
        } else if (result.affectedRows === 0) {
            res.status(404).send('No order found with the provided ID');
        } else {
          res.send('Order buyback...');
        }
    });
  }

  async cancelOrder(req, res) {
    const orderId = req.params.id;
    const sql = 'UPDATE orders SET status = 2, updated_at = NOW() WHERE id = ?';
    
    mysql.query(sql, [orderId], (err, result) => {
        if (err) {
            // console.error(err);
            res.status(500).send('Error canceling order');
        } else if (result.affectedRows === 0) {
            res.status(404).send('No order found with the provided ID');
        } else {
          res.send('Order cancelorder...');
        }
    });
  }

  async orderHistory(req, res) {
    const phone = req.params.phone;
    // Truy vấn cơ sở dữ liệu để lấy lịch sử mua hàng của người dùng có số điện thoại là phone
    const sql = `
      SELECT o.id AS order_id, o.deliveryMethod, o.paymentMenthod, CONVERT_TZ(o.created_at, '+00:00', '+07:00') AS order_created_at, CONVERT_TZ(o.updated_at, '+00:00', '+07:00') AS order_updated_at, o.note AS order_note, o.status AS order_status, o.addressID,
      u.id AS user_id, u.name AS user_name, u.phone AS user_phone, u.email AS user_email, da.email AS delivery_email, da.phone AS delivery_phone,
      CONCAT(da.city, ', ', da.District, ', ', da.Commune, ', ', da.Street) AS address,
      odp.*, p.*
      FROM orders o
      JOIN users u ON o.UserID = u.id
      JOIN delivery_address da ON o.addressID = da.id
      JOIN orderDetailsProduct odp ON o.id = odp.orderID
      JOIN product p ON odp.productID = p.id
      WHERE u.phone = ?
      ORDER BY o.created_at DESC
    `;
    mysql.query(sql, [phone], (err, result) => {
        if (err) throw err;
        res.send(result);
    });
  }

  async topLaptop(req, res) {
    const query = `
      SELECT product.*, MAX(productDetails.brand) as brand, galery.thumbnail
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
      AND product.CategoryID = 1 AND product.status = 1
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

  async topDienthoai(req, res) {
    const query = `
      SELECT product.*, MAX(productDetails.brand) as brand, galery.thumbnail
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
      AND product.CategoryID = 2 AND product.status = 1
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
  
  async Revenue(req, res) {
    let sql = `
    SELECT 
        DATE_FORMAT(o.updated_at, '%Y-%m') as updated_month, 
        SUM(p.price * od.quantity) as Revenue
    FROM 
        orders o
    JOIN 
        orderDetailsProduct od ON o.id = od.orderID
    JOIN 
        product p ON od.productID = p.id
    WHERE
        o.status = 4
    GROUP BY 
        DATE_FORMAT(o.updated_at, '%Y-%m')
    `;
    mysql.query(sql, (err, result) => {
      if(err) throw err;
      
      // Chuyển đổi dữ liệu
      const convertedData = result.reduce((acc, item) => {
        const monthExists = acc.find(data => data.updated_month === item.updated_month);
        
        if(monthExists){
          monthExists.Revenue += item.Revenue;
        } else {
          let newItem = {updated_month: item.updated_month, Revenue: item.Revenue};
          acc.push(newItem);
        }
        
        return acc;
      }, []);

      // Chuyển đổi số thành chuỗi với dấu phân cách hàng nghìn
      convertedData.forEach(item => {
        item.Revenue = item.Revenue.toLocaleString('en-US');
      });

      res.send(convertedData);
    });
  }

  async orderDate(req, res) {
    let sql = "SELECT status, UNIX_TIMESTAMP(CONVERT_TZ(updated_at, '+00:00', '+07:00')) as updated_Date, COUNT(*) as count FROM orders WHERE DATE(updated_at) = CURDATE() AND status IN (0, 1, 2, 3, 4, 5) GROUP BY status, UNIX_TIMESTAMP(CONVERT_TZ(updated_at, '+00:00', '+07:00'))";
    mysql.query(sql, (err, result) => {
      if(err) throw err;
      
      // Chuyển đổi dữ liệu
      const convertedData = result.reduce((acc, item) => {
        const dateExists = acc.find(data => data.updated_Date === item.updated_Date);
        
        if(dateExists){
          switch(item.status) {
            case 0:
              dateExists.ChuaXacNhan = item.count;
              break;
            case 1:
              dateExists.DaXacNhan = item.count;
              break;
            case 2:
              dateExists.DaHuy = item.count;
              break;
            case 3:
              dateExists.DangVanChuyen = item.count;
              break;
            case 4:
              dateExists.DaGiao = item.count;
              break;
            case 5:
              dateExists.GiaoKhongThanhCong = item.count;
              break;
          }
        } else {
          let newItem = {updated_Date: item.updated_Date};
          switch(item.status) {
            case 0:
              newItem.ChuaXacNhan = item.count;
              break;
            case 1:
              newItem.DaXacNhan = item.count;
              break;
            case 2:
              newItem.DaHuy = item.count;
              break;
            case 3:
              newItem.DangVanChuyen = item.count;
              break;
            case 4:
              newItem.DaGiao = item.count;
              break;
            case 5:
              newItem.GiaoKhongThanhCong = item.count;
              break;
          }
          acc.push(newItem);
        }
        
        return acc;
      }, []);      
      res.send(convertedData);
    });
  }
  


  async dashboard(req, res) {
    let sql = "SELECT status, UNIX_TIMESTAMP(CONVERT_TZ(updated_at, '+00:00', '+07:00')) as updated_date, COUNT(*) as count FROM orders WHERE status IN (4, 5) GROUP BY status, UNIX_TIMESTAMP(CONVERT_TZ(updated_at, '+00:00', '+07:00'))";
    mysql.query(sql, (err, result) => {
      if(err) throw err;
      
      // Chuyển đổi dữ liệu
      const convertedData = result.reduce((acc, item) => {
        const dateExists = acc.find(data => data.updated_date === item.updated_date);
        
        if(dateExists){
          switch(item.status) {
            case 4:
              dateExists.Delivered = item.count;
              break;
            case 5:
              dateExists.Deliveryfailed = item.count;
              break;
          }
        } else {
          let newItem = {updated_date: item.updated_date};
          switch(item.status) {
            case 4:
              newItem.Delivered = item.count;
              break;
            case 5:
              newItem.Deliveryfailed = item.count;
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