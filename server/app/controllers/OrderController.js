const mysql = require("../../config/db/mySQL");
const { da } = require("date-fns/locale");
const { query } = require("../../util/callbackToPromise");


class OrderController {
  // API /order/order
  async order(req, res) {
    const data = req.body;
    // console.log(data);

    if (!data) {
      return res.status(400).json("Invalid data");
    }

    // Kiểm tra số lượng sản phẩm hiện có
    let sql = `SELECT remaining_quantity FROM productdetails WHERE product_id = ?`;
    let values = [data.productID];
    mysql.query(sql, values, (err, result) => {
      if (err) throw err;
      // console.log(result);

      // Nếu số lượng mua hàng nhiều hơn số lượng sản phẩm hiện có
      if (data.quantity > result[0].remaining_quantity) {
        return res.status(400).json("Số lượng sản phẩm không đủ");
      }
  
      // Nếu số lượng mua hàng không vượt quá số lượng sản phẩm hiện có
      sql = `INSERT INTO orders (UserID,addressID, deliveryMethod, paymentMenthod, created_at, updated_at, note, totalAmount, status) VALUES (?,?, ?, ?, NOW(), NOW(), ?, ?, ?)`;
      values = [data.UserID, data.addressID, data.deliveryMethod, data.paymentMenthod, data.note, data.totalAmount, data.status];
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

  async Paymentmomo(req, res) {
    const data = req.body;
    console.log(data);

    if (!data) {
      return res.status(400).json("Invalid data");
    }
    let sql = `INSERT INTO orders (UserID,addressID, deliveryMethod, paymentMenthod, created_at, updated_at, note, paymentData, totalAmount, status) VALUES (?, ?, ?, ?, NOW(), NOW(), ?, ?, ?, ?)`;
    let values = [data.UserID, data.addressID, data.deliveryMethod, data.paymentMenthod, data.note, data.paymentData, data.totalAmount, data.status];
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
  }
  
  

  // async quanlyOrder(req, res, next) {
  //   const sql = `
  //     SELECT o.id AS order_id, o.deliveryMethod, o.paymentMenthod, CONVERT_TZ(o.created_at, '+00:00', '+07:00') AS order_created_at, CONVERT_TZ(o.updated_at, '+00:00', '+07:00') AS order_updated_at, o.note AS order_note, o.status AS order_status, o.addressID,
  //     u.id AS user_id, u.name AS user_name, u.phone AS user_phone, u.email AS user_email, da.email AS delivery_email, da.phone AS delivery_phone,
  //     CONCAT(da.city, ', ', da.District, ', ', da.Commune, ', ', da.Street) AS address,
  //     odp.*, p.*
  //     FROM orders o
  //     JOIN users u ON o.UserID = u.id
  //     JOIN delivery_address da ON o.addressID = da.id
  //     JOIN orderDetailsProduct odp ON o.id = odp.orderID
  //     JOIN product p ON odp.productID = p.id
  //     WHERE o.created_at >= DATE_SUB(NOW(), INTERVAL 1 MONTH)
  //     ORDER BY o.created_at DESC
  //   `;
  //   mysql.query(sql, (err, result) => {
  //       if (err) throw err;
  //       res.send(result);
  //   });
  // }

  async quanlyAllOrder(req, res, next) {
    const sql = `
      SELECT o.id AS order_id, o.deliveryMethod, o.paymentMenthod, CONVERT_TZ(o.created_at, '+00:00', '+07:00') AS order_created_at, CONVERT_TZ(o.updated_at, '+00:00', '+07:00') AS order_updated_at, o.note AS order_note, FORMAT(CAST(o.totalAmount AS UNSIGNED), 0) AS totalAmount, o.paymentData, o.status AS order_status, o.addressID,
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
              sql = `UPDATE productDetails SET remaining_quantity = remaining_quantity - ? WHERE product_id = ?`;
              values = [quantity, productID];
              mysql.query(sql, values, (err, result) => {
                if (err) throw err;
                // console.log(result);
              });
            }

            res.send('Order shipping and product quantity updated...');
          });
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
          res.send('Order delivered...');
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
              sql = `UPDATE productDetails SET remaining_quantity = remaining_quantity + ? WHERE product_id = ?`;
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

  async orderHistoryByPhone(req, res) {
    const phone = req.params.phone;
    // Truy vấn cơ sở dữ liệu để lấy lịch sử mua hàng của người dùng có số điện thoại là phone
    const sql = `
      SELECT o.id AS order_id, o.deliveryMethod, o.paymentMenthod, CONVERT_TZ(o.created_at, '+00:00', '+07:00') AS order_created_at, CONVERT_TZ(o.updated_at, '+00:00', '+07:00') AS order_updated_at, o.note AS order_note, FORMAT(CAST(o.totalAmount AS UNSIGNED), 0) AS totalAmount, o.paymentData, o.status AS order_status, o.addressID,
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

  async orderHistoryById(req, res) {
    const id = req.params.id;
    // Truy vấn cơ sở dữ liệu để lấy lịch sử mua hàng của người dùng có id là id
    const sql = `
      SELECT o.id AS order_id, o.deliveryMethod, o.paymentMenthod, CONVERT_TZ(o.created_at, '+00:00', '+07:00') AS order_created_at, CONVERT_TZ(o.updated_at, '+00:00', '+07:00') AS order_updated_at, o.note AS order_note, FORMAT(CAST(o.totalAmount AS UNSIGNED), 0) AS totalAmount, o.paymentData, o.status AS order_status, o.addressID,
      u.id AS user_id, u.name AS user_name, u.phone AS user_phone, u.email AS user_email, da.email AS delivery_email, da.phone AS delivery_phone,
      CONCAT(da.city, ', ', da.District, ', ', da.Commune, ', ', da.Street) AS address,
      odp.*, p.*
      FROM orders o
      JOIN users u ON o.UserID = u.id
      JOIN delivery_address da ON o.addressID = da.id
      JOIN orderDetailsProduct odp ON o.id = odp.orderID
      JOIN product p ON odp.productID = p.id
      WHERE u.id = ?
      ORDER BY o.created_at DESC
    `;
    mysql.query(sql, [id], (err, result) => {
        if (err) throw err;
        res.send(result);
    });
  }

  async topLaptop(req, res) {
    const query = `
      SELECT product.*, MAX(productDetails.brand) as brand, galery.thumbnail, productDetails.remaining_quantity
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
      GROUP BY product.id, galery.thumbnail, productDetails.remaining_quantity
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
      SELECT product.*, MAX(productDetails.brand) as brand, galery.thumbnail, productDetails.remaining_quantity
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
      GROUP BY product.id, galery.thumbnail, productDetails.remaining_quantity
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

  async RevenueDate(req, res) {
    let sql = `
    SELECT 
        DATE_FORMAT(o.updated_at, '%Y-%m-%d') as updated_day, 
        SUM(p.price * od.quantity) as Revenue
    FROM 
        orders o
    JOIN 
        orderDetailsProduct od ON o.id = od.orderID
    JOIN 
        product p ON od.productID = p.id
    WHERE
        o.status = 4 AND
        DATE_FORMAT(o.updated_at, '%Y-%m') = DATE_FORMAT(NOW(), '%Y-%m')
    GROUP BY 
        DATE_FORMAT(o.updated_at, '%Y-%m-%d')
    `;
    mysql.query(sql, (err, result) => {
      if(err) throw err;
      
      // Chuyển đổi dữ liệu
      const convertedData = result.reduce((acc, item) => {
        const dayExists = acc.find(data => data.updated_day === item.updated_day);
        
        if(dayExists){
          dayExists.Revenue += item.Revenue;
        } else {
          let newItem = {updated_day: item.updated_day, Revenue: item.Revenue};
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
    let sql = "SELECT status, DATE_FORMAT(CONVERT_TZ(updated_at, '+00:00', '+07:00'), '%Y-%m-%d') as updated_Date, COUNT(*) as count FROM orders WHERE MONTH(updated_at) = MONTH(CURRENT_DATE()) AND YEAR(updated_at) = YEAR(CURRENT_DATE()) AND status IN (0, 1, 2, 3, 4, 5) GROUP BY status, DATE_FORMAT(CONVERT_TZ(updated_at, '+00:00', '+07:00'), '%Y-%m-%d')";
    mysql.query(sql, (err, result) => {
      if(err) throw err;
      
      // Chuyển đổi dữ liệu
      const convertedData = result.reduce((acc, item) => {
        const dateExists = acc.find(data => data.updated_Date === item.updated_Date);
        
        if(dateExists){
          switch(item.status) {
            case 0:
              dateExists.ChuaXacNhan = (dateExists.ChuaXacNhan || 0) + item.count;
              break;
            case 1:
              dateExists.DaXacNhan = (dateExists.DaXacNhan || 0) + item.count;
              break;
            case 2:
              dateExists.DaHuy = (dateExists.DaHuy || 0) + item.count;
              break;
            case 3:
              dateExists.DangVanChuyen = (dateExists.DangVanChuyen || 0) + item.count;
              break;
            case 4:
              dateExists.DaGiao = (dateExists.DaGiao || 0) + item.count;
              break;
            case 5:
              dateExists.GiaoKhongThanhCong = (dateExists.GiaoKhongThanhCong || 0) + item.count;
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
    let sql = "SELECT status, DATE_FORMAT(CONVERT_TZ(updated_at, '+00:00', '+07:00'), '%Y-%m-%d') as updated_Date, COUNT(*) as count FROM orders WHERE status IN (4, 5) GROUP BY status, DATE_FORMAT(CONVERT_TZ(updated_at, '+00:00', '+07:00'), '%Y-%m-%d')";
    mysql.query(sql, (err, result) => {
      if(err) throw err;
      
      // Chuyển đổi dữ liệu
      const convertedData = result.reduce((acc, item) => {
        const dateExists = acc.find(data => data.updated_date === item.updated_date);
        
        if(dateExists){
          switch(item.status) {
            case 4:
              dateExists.DaGiao = (dateExists.DaGiao || 0) + item.count;
              break;
            case 5:
              dateExists.GiaoKhongThanhCong = (dateExists.GiaoKhongThanhCong || 0) + item.count;
              break;
          }
        } else {
          let newItem = {updated_date: item.updated_date};
          switch(item.status) {
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

  // /order/:id
  async getProduct(req, res) {
    try {
      const product_id = req.params.id;
      const sl_product = `SELECT 
      product.id,
      product.name,
      product.price,
      product.status,
      product.shortDescription,
      productDetails.brand,
      productDetails.quantity,
      productDetails.created_at,
      productDetails.configuration,
      productDetails.description,
      category.name as category,
      CONCAT('[', GROUP_CONCAT('{"color": "', prodetailcolor.Colorname, '"}' SEPARATOR ','), ']') as color,
      CONCAT('[', GROUP_CONCAT('{"galery": "', galery.thumbnail, '"}' SEPARATOR ','), ']') as galery
      FROM product
      JOIN productDetails ON product.id = productDetails.product_id
      JOIN category ON product.CategoryID = category.id
      LEFT JOIN prodetailcolor ON product.id = prodetailcolor.product_id
      LEFT JOIN galery ON product.id = galery.product_id
      WHERE product.id = ?
      GROUP BY product.id, product.name, product.price, product.status, productDetails.brand, 
      productDetails.quantity, product.shortDescription, productDetails.created_at, productDetails.configuration, 
      productDetails.description, category.name;`;
      const results = await query(sl_product, [product_id]);
      // chuyển string thành mảng (color, image)
      // color
      if (results[0]?.color) {
        const colorRaw = JSON.parse(results[0].color);
        let arrColor = [];
        colorRaw.forEach((color) => {
          arrColor.push(color.color);
        });
        results[0].color = arrColor;
      }

      // image
      if (results[0]?.galery) {
        const imageRaw = JSON.parse(results[0].galery);
        let arrimage = [];
        imageRaw.forEach((image) => {
          arrimage.push(image.galery);
        });
        results[0].galery = arrimage;
      }

      res.status(200).json(results);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Get product failed" });
    }
  }

}

module.exports = new OrderController();