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

    let sql = `INSERT INTO orders (UserID, deliveryMethod, paymentMenthod, created_at, updated_at, note, status) VALUES (?, ?, ?, NOW(), NOW(), ?, ?)`;
    let values = [data.UserID, data.deliveryMethod, data.paymentMenthod, data.note, data.status];
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
      SELECT o.id AS order_id, o.deliveryMethod, o.paymentMenthod, o.updated_at AS order_updated_at, o.note AS order_note, o.status AS order_status, 
      u.id AS user_id, u.name AS user_name, u.phone AS user_phone, u.email AS user_email, odp.*, p.*
      FROM orders o
      JOIN users u ON o.UserID = u.id
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
  
      res.send(convertedData);
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
              dateExists.Unconfirm = item.count;
              break;
            case 1:
              dateExists.Confirm = item.count;
              break;
            case 2:
              dateExists.Cancel = item.count;
              break;
          }
        } else {
          let newItem = {updated_date: item.updated_date};
          switch(item.status) {
            case 0:
              newItem.Unconfirm = item.count;
              break;
            case 1:
              newItem.Confirm = item.count;
              break;
            case 2:
              newItem.Cancel = item.count;
              break;
          }
          acc.push(newItem);
        }
        
        return acc;
      }, []);
  
      res.send(convertedData);
    });
  }

  async payment(req, res, next){
    var ipAddr = req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress;

    var config = require('config');
    var dateFormat = require('dateformat');

    
    var tmnCode = config.get('COB8SBMM');
    var secretKey = config.get('QAWFKRXBUVKWTSBCBQOOCGGFFYOCEPUD');
    var vnpUrl = config.get('https://sandbox.vnpayment.vn/paymentv2/vpcpay.html');
    var returnUrl = config.get('http://localhost:8080/thanks');

    var date = new Date();

    var createDate = dateFormat(date, 'yyyymmddHHmmss');
    var orderId = dateFormat(date, 'HHmmss');
    var amount = req.body.amount;
    var bankCode = req.body.bankCode;
    
    var orderInfo = req.body.orderDescription;
    var orderType = req.body.orderType;
    var locale = req.body.language;
    if(locale === null || locale === ''){
        locale = 'vn';
    }
    var currCode = 'VND';
    var vnp_Params = {};
    vnp_Params['vnp_Version'] = '2.1.0';
    vnp_Params['vnp_Command'] = 'pay';
    vnp_Params['vnp_TmnCode'] = tmnCode;
    // vnp_Params['vnp_Merchant'] = ''
    vnp_Params['vnp_Locale'] = locale;
    vnp_Params['vnp_CurrCode'] = currCode;
    vnp_Params['vnp_TxnRef'] = orderId;
    vnp_Params['vnp_OrderInfo'] = orderInfo;
    vnp_Params['vnp_OrderType'] = orderType;
    vnp_Params['vnp_Amount'] = amount * 100;
    vnp_Params['vnp_ReturnUrl'] = returnUrl;
    vnp_Params['vnp_IpAddr'] = ipAddr;
    vnp_Params['vnp_CreateDate'] = createDate;
    if(bankCode !== null && bankCode !== ''){
        vnp_Params['vnp_BankCode'] = bankCode;
    }

    vnp_Params = sortObject(vnp_Params);

    var querystring = require('qs');
    var signData = querystring.stringify(vnp_Params, { encode: false });
    var crypto = require("crypto");     
    var hmac = crypto.createHmac("sha512", secretKey);
    var signed = hmac.update(new Buffer(signData, 'utf-8')).digest("hex"); 
    vnp_Params['vnp_SecureHash'] = signed;
    vnpUrl += '?' + querystring.stringify(vnp_Params, { encode: false });

    res.redirect(vnpUrl)
  }
}

module.exports = new OrderController();