const mysql = require("../../config/db/mySQL");
const { da } = require("date-fns/locale");
const { query } = require("../../util/callbackToPromise");


class OrderController {
  // API /order/order
  async order(req, res) {
    const data = req.body;
    console.log(data);

    if (!data) {
      return res.status(400).json("Invalid data");
    }

    // // Kiểm tra số lượng sản phẩm hiện có
    // let sql = `SELECT remaining_quantity_variant FROM product_variations WHERE product_id = ?`;

    let canBuy = true;

    // // Duyệt qua mỗi productID trong mảng
    // for (let i = 0; i < data.productID.length; i++) {
    //     let values = [data.productID[i]];

    //     // Sử dụng Promise để đảm bảo rằng truy vấn này hoàn thành trước khi tiếp tục
    //     const productResult = await new Promise((resolve, reject) => {
    //         mysql.query(sql, values, (err, result) => {
    //             if (err) reject(err);
    //             resolve(result);
    //         });
    //     });

    //     // Nếu số lượng mua hàng nhiều hơn số lượng sản phẩm hiện có
    //     if (data.quantity[i] > productResult[0].remaining_quantity_variant) {
    //         canBuy = false;
    //         return res.status(400).json("Số lượng sản phẩm không đủ");
    //     }
    // }

    // Tạo một đơn hàng mới
    if (canBuy) {
      let sql = `INSERT INTO orders (UserID, addressID, deliveryMethod, paymentMenthod, created_at, updated_at, note, paymentData, totalAmount, status) VALUES (?, ?, ?, ?, NOW(), NOW(), ?, ?, ?, ?)`;
      let values = [data.UserID, data.addressID, data.deliveryMethod, data.paymentMenthod, data.note, data.paymentData, data.totalAmount, data.status];
      mysql.query(sql, values, (err, result) => {
        if (err) throw err;
          // console.log(result);
          const orderID = result.insertId; // Lấy ID của đơn hàng vừa được tạo
          // Duyệt qua mỗi productID trong mảng
          for (let i = 0; i < data.productID.length; i++) {
            sql = `INSERT INTO orderDetailsProduct (productID, quantity, color, capacity, totalPrice, discount, coupons, orderID) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`; // Thêm dữ liệu vào bảng orderDetailsProduct
            values = [data.productID[i], data.quantity[i], data.color[i], data.capacity[i], data.totalPrice[i], data.discount[i], data.coupons[i], orderID]; // Thêm dữ liệu vào bảng orderDetailsProduct
            mysql.query(sql, values, (err, result) => {
                if (err) throw err;
            });
          }
      });
    }
    // Gửi phản hồi sau khi tất cả các sản phẩm đã được xử lý
    res.send('Order details added...');
  }




  async Paymentmomo(req, res) {
    const data = req.body;
    // console.log(data);

    if (!data) {
      return res.status(400).json("Invalid data");
    }
    let sql = `INSERT INTO orders (UserID,addressID, deliveryMethod, paymentMenthod, created_at, updated_at, note, paymentData, totalAmount, status) VALUES (?, ?, ?, ?, NOW(), NOW(), ?, ?, ?, ?)`;
    let values = [data.UserID, data.addressID, data.deliveryMethod, data.paymentMenthod, data.note, data.paymentData, data.totalAmount, data.status];
    mysql.query(sql, values, (err, result) => {
    if (err) throw err;
      // console.log(result);
      const orderID = result.insertId; // Lấy ID của đơn hàng vừa được tạo
      // Duyệt qua mỗi productID trong mảng
      for (let i = 0; i < data.productID.length; i++) {
        sql = `INSERT INTO orderDetailsProduct (productID, quantity, color, capacity, totalPrice, discount, coupons, orderID) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`; // Thêm dữ liệu vào bảng orderDetailsProduct
        values = [data.productID[i], data.quantity[i], data.color[i], data.capacity[i], data.totalPrice[i], data.discount[i], data.coupons[i], orderID]; // Thêm dữ liệu vào bảng orderDetailsProduct
        mysql.query(sql, values, (err, result) => {
          if (err) throw err;
        });
      }
    });
    // Gửi phản hồi sau khi tất cả các sản phẩm đã được xử lý
    res.send('Order details added...');
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

  // API /order/order
  async quanlyAllOrder(req, res, next) {
    const sql = `
      SELECT o.id AS order_id, o.deliveryMethod, o.paymentMenthod, CONVERT_TZ(o.created_at, '+00:00', '+07:00') AS order_created_at, CONVERT_TZ(o.updated_at, '+00:00', '+07:00') AS order_updated_at, o.note AS order_note, FORMAT(CAST(o.totalAmount AS UNSIGNED), 0) AS totalAmount, o.paymentData, o.status AS order_status, o.addressID,
      u.id AS user_id, u.name AS user_name, u.phone AS user_phone, u.email AS user_email, da.email AS delivery_email, da.phone AS delivery_phone,
      CONCAT(da.city, ', ', da.District, ', ', da.Commune, ', ', da.Street) AS address,
      odp.*, p.*, dc.*
      FROM orders o
      JOIN users u ON o.UserID = u.id
      JOIN delivery_address da ON o.addressID = da.id
      JOIN orderDetailsProduct odp ON o.id = odp.orderID
      JOIN products p ON odp.productID = p.id
      LEFT JOIN discount_code dc ON odp.coupons = dc.id
      ORDER BY o.created_at DESC
    `;
    mysql.query(sql, (err, result) => {
      if (err) throw err;
  
      // Nhóm các sản phẩm theo order_id
      let orders = {};
      result.forEach(row => {
        if (!orders[row.order_id]) {
          orders[row.order_id] = {
            order_id: row.order_id,
            deliveryMethod: row.deliveryMethod,
            paymentMenthod: row.paymentMenthod,
            order_created_at: row.order_created_at,
            order_updated_at: row.order_updated_at,
            order_note: row.order_note,
            totalAmount: row.totalAmount,
            paymentData: row.paymentData,
            order_status: row.order_status,
            addressID: row.addressID,
            user_id: row.user_id,
            user_name: row.user_name,
            user_phone: row.user_phone,
            user_email: row.user_email,
            delivery_email: row.delivery_email,
            delivery_phone: row.delivery_phone,
            address: row.address,
            products: []
          };
        }
        orders[row.order_id].products.push({
          productID: row.productID,
          quantity: row.quantity,
          color: row.color,
          capacity: row.capacity,
          totalPrice: row.totalPrice,
          name: row.name,
          shortDescription: row.shortDescription,
          CategoryID: row.CategoryID,
          main_image: row.main_image,
          release_date: row.release_date,
          status: row.status,
          discount_code: row.id ? {
            id: row.id,
            content: row.content,
            value_vnd: row.value_vnd,
            value_percent: row.value_percent,
            start_date: row.start_date,
            end_date: row.end_date
          } : null
        });
      });
  
      // Chuyển đổi đối tượng orders thành một mảng
      orders = Object.values(orders);
  
      res.send(orders);
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
          let sql = `SELECT productID, quantity, color, capacity FROM orderDetailsProduct WHERE orderID = ?`;
          let values = [orderId];
          mysql.query(sql, values, (err, orderDetails) => {
            if (err) throw err;

            // Duyệt qua từng sản phẩm trong đơn hàng
            for (let i = 0; i < orderDetails.length; i++) {
              const productID = orderDetails[i].productID;
              const quantity = orderDetails[i].quantity;
              const color = orderDetails[i].color;
              const capacity = orderDetails[i].capacity;

              // Cập nhật số lượng sản phẩm trong bảng productDetails
              sql = `UPDATE product_variations SET remaining_quantity_variant = remaining_quantity_variant - ? WHERE product_id = ? AND color = ? AND capacity = ?`;
              values = [quantity, productID, color, capacity];
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
          let sql = `SELECT productID, quantity, color, capacity FROM orderDetailsProduct WHERE orderID = ?`;
          let values = [orderId];
          mysql.query(sql, values, (err, orderDetails) => {
            if (err) throw err;

            // Duyệt qua từng sản phẩm trong đơn hàng
            for (let i = 0; i < orderDetails.length; i++) {
              const productID = orderDetails[i].productID;
              const quantity = orderDetails[i].quantity;
              const color = orderDetails[i].color;
              const capacity = orderDetails[i].capacity;

              // Cập nhật số lượng sản phẩm trong bảng productDetails
              sql = `UPDATE product_variations SET remaining_quantity_variant = remaining_quantity_variant + ? WHERE product_id = ? AND color = ? AND capacity = ?`;
              values = [quantity, productID, color, capacity];
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


  async UndocancelOrder(req, res) {
    const orderId = req.params.id;
    const sql = 'UPDATE orders SET status = 0, updated_at = NOW() WHERE id = ?';
    
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

  async UndoOrder(req, res) {
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

  async UndofailedOrder(req, res) {
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
              const color = orderDetails[i].color;
              const capacity = orderDetails[i].capacity;

              // Cập nhật số lượng sản phẩm trong bảng productDetails
              sql = `UPDATE product_variations SET remaining_quantity_variant = remaining_quantity_variant - ? WHERE product_id = ? AND color = ? AND capacity = ?`;
              values = [quantity, productID, color, capacity];
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

  // API /order/order
  async orderHistoryByPhone(req, res) {
    const phone = req.params.phone;
    const sql = `
      SELECT o.id AS order_id, o.deliveryMethod, o.paymentMenthod, CONVERT_TZ(o.created_at, '+00:00', '+07:00') AS order_created_at, CONVERT_TZ(o.updated_at, '+00:00', '+07:00') AS order_updated_at, o.note AS order_note, FORMAT(CAST(o.totalAmount AS UNSIGNED), 0) AS totalAmount, o.paymentData, o.status AS order_status, o.addressID,
      u.id AS user_id, u.name AS user_name, u.phone AS user_phone, u.email AS user_email, da.email AS delivery_email, da.phone AS delivery_phone,
      CONCAT(da.city, ', ', da.District, ', ', da.Commune, ', ', da.Street) AS address,
      odp.*, p.*, dc.*
      FROM orders o
      JOIN users u ON o.UserID = u.id
      JOIN delivery_address da ON o.addressID = da.id
      JOIN orderDetailsProduct odp ON o.id = odp.orderID
      JOIN products p ON odp.productID = p.id
      LEFT JOIN discount_code dc ON odp.coupons = dc.id
      WHERE u.phone = ?
      ORDER BY o.created_at DESC
    `;
    mysql.query(sql, [phone], (err, result) => {
      if (err) throw err;
  
      // Nhóm các sản phẩm theo order_id
      let orders = {};
      result.forEach(row => {
        if (!orders[row.order_id]) {
          orders[row.order_id] = {
            order_id: row.order_id,
            deliveryMethod: row.deliveryMethod,
            paymentMenthod: row.paymentMenthod,
            order_created_at: row.order_created_at,
            order_updated_at: row.order_updated_at,
            order_note: row.order_note,
            totalAmount: row.totalAmount,
            paymentData: row.paymentData,
            order_status: row.order_status,
            addressID: row.addressID,
            user_id: row.user_id,
            user_name: row.user_name,
            user_phone: row.user_phone,
            user_email: row.user_email,
            delivery_email: row.delivery_email,
            delivery_phone: row.delivery_phone,
            address: row.address,
            products: []
          };
        }
        orders[row.order_id].products.push({
          productID: row.productID,
          quantity: row.quantity,
          color: row.color,
          capacity: row.capacity,
          totalPrice: row.totalPrice,
          name: row.name,
          shortDescription: row.shortDescription,
          CategoryID: row.CategoryID,
          main_image: row.main_image,
          release_date: row.release_date,
          status: row.status,
          discount_code: row.id ? {
            id: row.id,
            content: row.content,
            value_vnd: row.value_vnd,
            value_percent: row.value_percent,
            start_date: row.start_date,
            end_date: row.end_date
          } : null
        });
      });
  
      // Chuyển đổi đối tượng orders thành một mảng
      orders = Object.values(orders);
  
      res.send(orders);
    });
  }  

  // API /order/order
  async orderHistoryById(req, res) {
    const id = req.params.id;
    const sql = `
      SELECT o.id AS order_id, o.deliveryMethod, o.paymentMenthod, CONVERT_TZ(o.created_at, '+00:00', '+07:00') AS order_created_at, CONVERT_TZ(o.updated_at, '+00:00', '+07:00') AS order_updated_at, o.note AS order_note, FORMAT(CAST(o.totalAmount AS UNSIGNED), 0) AS totalAmount, o.paymentData, o.status AS order_status, o.addressID,
      u.id AS user_id, u.name AS user_name, u.phone AS user_phone, u.email AS user_email, da.email AS delivery_email, da.phone AS delivery_phone,
      CONCAT(da.city, ', ', da.District, ', ', da.Commune, ', ', da.Street) AS address,
      odp.*, p.*, dc.*
      FROM orders o
      JOIN users u ON o.UserID = u.id
      JOIN delivery_address da ON o.addressID = da.id
      JOIN orderDetailsProduct odp ON o.id = odp.orderID
      JOIN products p ON odp.productID = p.id
      LEFT JOIN discount_code dc ON odp.coupons = dc.id
      WHERE u.id = ?
      ORDER BY o.created_at DESC
    `;
    mysql.query(sql, [id], (err, result) => {
      if (err) throw err;
  
      // Nhóm các sản phẩm theo order_id
      let orders = {};
      result.forEach(row => {
        if (!orders[row.order_id]) {
          orders[row.order_id] = {
            order_id: row.order_id,
            deliveryMethod: row.deliveryMethod,
            paymentMenthod: row.paymentMenthod,
            order_created_at: row.order_created_at,
            order_updated_at: row.order_updated_at,
            order_note: row.order_note,
            totalAmount: row.totalAmount,
            paymentData: row.paymentData,
            order_status: row.order_status,
            addressID: row.addressID,
            user_id: row.user_id,
            user_name: row.user_name,
            user_phone: row.user_phone,
            user_email: row.user_email,
            delivery_email: row.delivery_email,
            delivery_phone: row.delivery_phone,
            address: row.address,
            products: []
          };
        }
        orders[row.order_id].products.push({
          productID: row.productID,
          quantity: row.quantity,
          color: row.color,
          capacity: row.capacity,
          totalPrice: row.totalPrice,
          name: row.name,
          shortDescription: row.shortDescription,
          CategoryID: row.CategoryID,
          main_image: row.main_image,
          release_date: row.release_date,
          status: row.status,
          discount_code: row.id ? {
            id: row.id,
            content: row.content,
            value_vnd: row.value_vnd,
            value_percent: row.value_percent,
            start_date: row.start_date,
            end_date: row.end_date
          } : null
        });
      });
  
      // Chuyển đổi đối tượng orders thành một mảng
      orders = Object.values(orders);
  
      res.send(orders);
    });
  }  

  async topLaptop(req, res) {
    const query = `
      SELECT  
        p.*, 
        MAX(pd.brand) as brand, 
        SUM(odp.quantity) as total_quantity_ordered, 
        pv.remaining_quantity_variant as remaining_quantity
      FROM 
        products p
      JOIN 
        product_variations pv ON p.id = pv.product_id
      JOIN 
        productDetails pd ON p.id = pd.product_id
      JOIN 
        orderDetailsProduct odp ON p.id = odp.productID
      JOIN 
        orders o ON odp.orderID = o.id
      WHERE 
        o.created_at >= DATE_SUB(NOW(), INTERVAL 5 MONTH)
        AND p.CategoryID = 1 
        AND p.status = 1
      GROUP BY 
        p.id, pv.remaining_quantity_variant
      ORDER BY 
        total_quantity_ordered DESC
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
      SELECT  
        p.*, 
        MAX(pd.brand) as brand, 
        SUM(odp.quantity) as total_quantity_ordered, 
        pv.remaining_quantity_variant as remaining_quantity
      FROM 
        products p
      JOIN 
        product_variations pv ON p.id = pv.product_id
      JOIN 
        productDetails pd ON p.id = pd.product_id
      JOIN 
        orderDetailsProduct odp ON p.id = odp.productID
      JOIN 
        orders o ON odp.orderID = o.id
      WHERE 
        o.created_at >= DATE_SUB(NOW(), INTERVAL 5 MONTH)
        AND p.CategoryID = 2 
        AND p.status = 1
      GROUP BY 
        p.id, pv.remaining_quantity_variant
      ORDER BY 
        total_quantity_ordered DESC
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
        SUM(totalAmount) as Revenue
    FROM 
        orders o
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
        SUM(totalAmount) as Revenue
    FROM 
        orders o
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
    const query = `
      SELECT p.name, SUM(odp.quantity) AS Total_Quantity
      FROM orders o
      JOIN orderDetailsProduct odp ON o.id = odp.orderID
      JOIN products p ON odp.productID = p.id
      WHERE o.status = 4 AND DATE(o.updated_at) = CURDATE()
      GROUP BY p.name;
    `;
    mysql.query(query, (error, results) => {
      if (error) throw error;
      res.json(results);
    });
    // let sql = "SELECT status, DATE_FORMAT(CONVERT_TZ(updated_at, '+00:00', '+07:00'), '%Y-%m-%d') as updated_Date, COUNT(*) as count FROM orders WHERE MONTH(updated_at) = MONTH(CURRENT_DATE()) AND YEAR(updated_at) = YEAR(CURRENT_DATE()) AND status IN (0, 1, 2, 3, 4, 5) GROUP BY status, DATE_FORMAT(CONVERT_TZ(updated_at, '+00:00', '+07:00'), '%Y-%m-%d')";
    // mysql.query(sql, (err, result) => {
    //   if(err) throw err;
      
    //   // Chuyển đổi dữ liệu
    //   const convertedData = result.reduce((acc, item) => {
    //     const dateExists = acc.find(data => data.updated_Date === item.updated_Date);
        
    //     if(dateExists){
    //       switch(item.status) {
    //         case 0:
    //           dateExists.ChuaXacNhan = (dateExists.ChuaXacNhan || 0) + item.count;
    //           break;
    //         case 1:
    //           dateExists.DaXacNhan = (dateExists.DaXacNhan || 0) + item.count;
    //           break;
    //         case 2:
    //           dateExists.DaHuy = (dateExists.DaHuy || 0) + item.count;
    //           break;
    //         case 3:
    //           dateExists.DangVanChuyen = (dateExists.DangVanChuyen || 0) + item.count;
    //           break;
    //         case 4:
    //           dateExists.DaGiao = (dateExists.DaGiao || 0) + item.count;
    //           break;
    //         case 5:
    //           dateExists.GiaoKhongThanhCong = (dateExists.GiaoKhongThanhCong || 0) + item.count;
    //           break;
    //       }
    //     } else {
    //       let newItem = {updated_Date: item.updated_Date};
    //       switch(item.status) {
    //         case 0:
    //           newItem.ChuaXacNhan = item.count;
    //           break;
    //         case 1:
    //           newItem.DaXacNhan = item.count;
    //           break;
    //         case 2:
    //           newItem.DaHuy = item.count;
    //           break;
    //         case 3:
    //           newItem.DangVanChuyen = item.count;
    //           break;
    //         case 4:
    //           newItem.DaGiao = item.count;
    //           break;
    //         case 5:
    //           newItem.GiaoKhongThanhCong = item.count;
    //           break;
    //       }
    //       acc.push(newItem);
    //     }
        
    //     return acc;
    //   }, []);      
    //   res.send(convertedData);

    // });
  }

  async BrandstatisticsLaptop(req, res) {
    const query = `
      SELECT 
      pd.brand,
      ROUND((SUM(odp.quantity) / (SELECT SUM(odp_inner.quantity) FROM orderDetailsProduct odp_inner
                                  JOIN orders o_inner ON odp_inner.orderID = o_inner.id
                                  JOIN products p_inner ON odp_inner.productID = p_inner.id
                                  WHERE o_inner.created_at >= DATE_SUB(NOW(), INTERVAL 2 YEAR)
                                  AND o_inner.status = 4
                                  AND p_inner.CategoryID = 1)) * 100, 2) AS percentage_sold
      FROM 
        products p
      JOIN 
        orderDetailsProduct odp ON p.id = odp.productID
      JOIN 
        orders o ON odp.orderID = o.id
      JOIN 
        productDetails pd ON p.id = pd.product_id
      WHERE 
        o.created_at >= DATE_SUB(NOW(), INTERVAL 2 YEAR)
        AND p.CategoryID = 1
        AND o.status = 4
      GROUP BY 
        pd.brand
      ORDER BY 
        percentage_sold DESC
    `;
    mysql.query(query, (error, results) => {
      if (error) throw error;
      res.json(results);
    });
  }

  async BrandstatisticsDienthoai(req, res) {
    const query = `
      SELECT 
      pd.brand,
      ROUND((SUM(odp.quantity) / (SELECT SUM(odp_inner.quantity) FROM orderDetailsProduct odp_inner
                                  JOIN orders o_inner ON odp_inner.orderID = o_inner.id
                                  JOIN products p_inner ON odp_inner.productID = p_inner.id
                                  WHERE o_inner.created_at >= DATE_SUB(NOW(), INTERVAL 2 YEAR)
                                  AND o_inner.status = 4
                                  AND p_inner.CategoryID = 2)) * 100, 2) AS percentage_sold
      FROM 
        products p
      JOIN 
        orderDetailsProduct odp ON p.id = odp.productID
      JOIN 
        orders o ON odp.orderID = o.id
      JOIN 
        productDetails pd ON p.id = pd.product_id
      WHERE 
        o.created_at >= DATE_SUB(NOW(), INTERVAL 2 YEAR)
        AND p.CategoryID = 2
        AND o.status = 4
      GROUP BY 
        pd.brand
      ORDER BY 
        percentage_sold DESC
    `;
    mysql.query(query, (error, results) => {
      if (error) throw error;
      res.json(results);
    });
  }

  async dashboard(req, res) {

    const query = `
      SELECT p.name, SUM(odp.quantity) AS Total_Quantity
      FROM orders o
      JOIN orderDetailsProduct odp ON o.id = odp.orderID
      JOIN products p ON odp.productID = p.id
      WHERE o.status = 4 AND o.updated_at > DATE_SUB(NOW(), INTERVAL 1 MONTH)
      GROUP BY p.name;
    `;
    mysql.query(query, (error, results) => {
      if (error) throw error;
      res.json(results);
    });
    
    // let sql = "SELECT status, DATE_FORMAT(CONVERT_TZ(updated_at, '+00:00', '+07:00'), '%Y-%m-%d') as updated_Date, COUNT(*) as count FROM orders WHERE status IN (4, 5) GROUP BY status, DATE_FORMAT(CONVERT_TZ(updated_at, '+00:00', '+07:00'), '%Y-%m-%d')";
    // mysql.query(sql, (err, result) => {
    //   if(err) throw err;
      
    //   // Chuyển đổi dữ liệu
    //   const convertedData = result.reduce((acc, item) => {
    //     const dateExists = acc.find(data => data.updated_date === item.updated_date);
        
    //     if(dateExists){
    //       switch(item.status) {
    //         case 4:
    //           dateExists.DaGiao = (dateExists.DaGiao || 0) + item.count;
    //           break;
    //         case 5:
    //           dateExists.GiaoKhongThanhCong = (dateExists.GiaoKhongThanhCong || 0) + item.count;
    //           break;
    //       }
    //     } else {
    //       let newItem = {updated_date: item.updated_date};
    //       switch(item.status) {
    //         case 4:
    //           newItem.DaGiao = item.count;
    //           break;
    //         case 5:
    //           newItem.GiaoKhongThanhCong = item.count;
    //           break;
    //       }
    //       acc.push(newItem);
    //     }
        
    //     return acc;
    //   }, []);
    
    //   res.send(convertedData);

    // });
  }

  // /order/:id
  async getProduct(req, res) {
    try {
      const product_id = req.params.id;
      const sl_product = `SELECT 
      product.*,
      productDetails.brand,
      productDetails.quantity,
      productDetails.created_at,
      productDetails.configuration,
      category.name as category,
      CONCAT('[', GROUP_CONCAT('{"color": "', prodetailcolor.Colorname, '"}' SEPARATOR ','), ']') as color,
      CONCAT('[', GROUP_CONCAT('{"galery": "', galery.thumbnail, '"}' SEPARATOR ','), ']') as galery
      FROM products
      JOIN productDetails ON product.id = productDetails.product_id
      JOIN category ON product.CategoryID = category.id
      LEFT JOIN prodetailcolor ON product.id = prodetailcolor.product_id
      LEFT JOIN galery ON product.id = galery.product_id
      WHERE product.id = ?
      GROUP BY product.id, product.name, product.price, product.status, productDetails.brand, 
      productDetails.quantity, product.shortDescription, productDetails.created_at, productDetails.configuration, 
      category.name;`;
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