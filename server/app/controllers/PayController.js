const mysql = require("../../config/db/mySQL");
let $ = require('jquery');
const axios = require('axios');
const moment = require('moment');
let globalAmount;
let User;
let address;
let product;
let quantitys;
let colors;
let capacitys;
let deliveryMethodd;
let paymentMenthodd;
let notee;
let amount;
let totalPrices;
let statuss;


class PayController {
    
    async Set_amount(req, res){
        globalAmount = req.body.amount; // Lưu amount vào biến toàn cục
        // console.log('amount: ', globalAmount);
        res.end();
    }

    async create_payment_url(req, res){
        const amount = globalAmount; // Lấy giá trị amount từ biến toàn cục
        // console.log('amount: '+amount);
        res.render('order', {title: 'Tạo mới đơn hàng', amount: amount}) // Sử dụng giá trị amount để render trang
    }

    async OrderList(req, res){
        res.render('orderlist', { title: 'Danh sách đơn hàng' })
    }

    async Querydr(req, res){
        let desc = 'truy van ket qua thanh toan';
        res.render('querydr', {title: 'Truy vấn kết quả thanh toán'})
    }

    async Refund(req, res){
        let desc = 'Hoan tien GD thanh toan';
        res.render('refund', {title: 'Hoàn tiền giao dịch thanh toán'})
    }

    async checkQuantity(productID, quantity) {
        return new Promise((resolve, reject) => {
            let sql = `SELECT remaining_quantity FROM productdetails WHERE product_id = ?`;
            let values = [productID];
            mysql.query(sql, values, (err, result) => {
                if (err) {
                    reject(err);
                } else if (quantity > result[0].remaining_quantity) {
                    reject("Số lượng sản phẩm không đủ");
                } else {
                    resolve();
                }
            });
        });
    }

    async Post_create_payment(req, res, next){
        const data = req.body;
        // console.log(data);
        
        User = req.body.UserID;
        address = req.body.addressID;
        product = req.body.productID;
        quantitys = req.body.quantity;
        colors = req.body.color,
        capacitys = req.body.capacity,
        deliveryMethodd = req.body.deliveryMethod;
        paymentMenthodd = req.body.paymentMenthod;
        notee = req.body.note;
        totalPrices = req.body.totalPrice,
        amount = req.body.amount;
        statuss = req.body.status;
        
        // Kiểm tra số lượng sản phẩm hiện có
        let sql = `SELECT remaining_quantity_variant FROM product_variations WHERE product_id = ?`;

        let canBuy = true;

        // Duyệt qua mỗi productID trong mảng
        for (let i = 0; i < product.length; i++) {
            let values = [product[i]];

            // Sử dụng Promise để đảm bảo rằng truy vấn này hoàn thành trước khi tiếp tục
            const productResult = await new Promise((resolve, reject) => {
                mysql.query(sql, values, (err, result) => {
                    if (err) reject(err);
                    resolve(result);
                });
            });

            // Nếu số lượng mua hàng nhiều hơn số lượng sản phẩm hiện có
            if (quantitys[i] > productResult[0].remaining_quantity_variant) {
                canBuy = false;
                return res.status(400).json("Số lượng sản phẩm không đủ");
            }
        }

        // Nếu số lượng mua hàng ít hơn hoặc bằng số lượng sản phẩm hiện có
        if (canBuy) {
            process.env.TZ = 'Asia/Ho_Chi_Minh';
        
            let date = new Date();
            let createDate = moment(date).format('YYYYMMDDHHmmss');
            
            let ipAddr = req.headers['x-forwarded-for'] ||
                req.connection.remoteAddress ||
                req.socket.remoteAddress ||
                req.connection.socket.remoteAddress;

            let config = require('../../config/default.json');
            
            let tmnCode = config.vnp_TmnCode;
            let secretKey = config.vnp_HashSecret;
            let vnpUrl = config.vnp_Url;
            let returnUrl = config.vnp_ReturnUrl;
            let orderId = moment(date).format('DDHHmmss');
            let bankCode = req.body.bankCode;

            // console.log('bank: '+bankCode)
            
            let locale = req.body.language;
            if(locale === null || locale === ''){
                locale = 'vn';
            }
            // console.log(locale)
            let currCode = 'VND';
            let vnp_Params = {};
            vnp_Params['vnp_Version'] = '2.1.0';
            vnp_Params['vnp_Command'] = 'pay';
            vnp_Params['vnp_TmnCode'] = tmnCode;
            vnp_Params['vnp_Locale'] = locale;
            vnp_Params['vnp_CurrCode'] = currCode;
            vnp_Params['vnp_TxnRef'] = orderId;
            vnp_Params['vnp_OrderInfo'] = orderId;
            vnp_Params['vnp_OrderType'] = 'other';
            vnp_Params['vnp_Amount'] = amount*100;
            vnp_Params['vnp_ReturnUrl'] = returnUrl;
            vnp_Params['vnp_IpAddr'] = ipAddr;
            vnp_Params['vnp_CreateDate'] = createDate;
            
            if(bankCode !== null && bankCode !== ''){
                vnp_Params['vnp_BankCode'] = bankCode;
            }

            vnp_Params = sortObject(vnp_Params);

            let querystring = require('qs');
            let signData = querystring.stringify(vnp_Params, { encode: false });
            let crypto = require("crypto");     
            let hmac = crypto.createHmac("sha512", secretKey);
            let signed = hmac.update(new Buffer(signData, 'utf-8')).digest("hex"); 
            vnp_Params['vnp_SecureHash'] = signed;
            vnpUrl += '?' + querystring.stringify(vnp_Params, { encode: false });

            res.json({ url: vnpUrl }); // Trả về URL trong một đối tượng JSON
        }

        // // Kiểm tra số lượng sản phẩm hiện có
        // let sql = `SELECT remaining_quantity FROM productdetails WHERE product_id = ?`;
        // let values = [product];
        // mysql.query(sql, values, (err, result) => {
        //     if (err) throw err;
        //     // console.log(result);

        //     // Nếu số lượng mua hàng nhiều hơn số lượng sản phẩm hiện có
        //     if (quantitys > result[0].remaining_quantity) {
        //         return res.status(400).json("Số lượng sản phẩm không đủ");
        //     }

        //     // Nếu số lượng mua hàng ít hơn hoặc bằng số lượng sản phẩm hiện có
        //     if (quantitys <= result[0].remaining_quantity) {
                
        //     }  
        // });
    }

    async Vnpay_return(req, res, next){
        let vnp_Params = req.query;

        let UserID = User;
        let addressID = address;
        let productID = product;
        let quantity = quantitys;
        let color = colors;
        let capacity = capacitys;
        let totalPrice = totalPrices;
        let deliveryMethod = deliveryMethodd;
        let paymentMenthod = paymentMenthodd;
        let note = notee;
        let totalAmount = amount;
        let status = statuss;
        totalAmount/100;

        let secureHash = vnp_Params['vnp_SecureHash'];

        delete vnp_Params['vnp_SecureHash'];
        delete vnp_Params['vnp_SecureHashType'];

        vnp_Params = sortObject(vnp_Params);

        let config = require('../../config/default.json');
        let tmnCode = config.vnp_TmnCode;
        let secretKey = config.vnp_HashSecret;

        let querystring = require('qs');
        let signData = querystring.stringify(vnp_Params, { encode: false });
        let crypto = require("crypto");     
        let hmac = crypto.createHmac("sha512", secretKey);
        let signed = hmac.update(new Buffer(signData, 'utf-8')).digest("hex");
        // console.log("return: " + JSON.stringify(vnp_Params));
        let paymentData = JSON.stringify(vnp_Params);

        //Lưu đơn hàng vào csdl
        let sql = `INSERT INTO orders (UserID, addressID, deliveryMethod, paymentMenthod, created_at, updated_at, note, paymentData, totalAmount, status) VALUES (?, ?, ?, ?, NOW(), NOW(), ?, ?, ?, ?)`;
        let values = [UserID, addressID, deliveryMethod, paymentMenthod, note, paymentData, totalAmount, status];
        mysql.query(sql, values, (err, result) => {
            if (err) throw err;
            const orderID = result.insertId; // Lấy ID của đơn hàng vừa được tạo
            // Biến đếm số lượng sản phẩm đã được lưu
            let count = 0;

            // Duyệt qua mỗi productID trong mảng
            for (let i = 0; i < productID.length; i++) {
                let values = [productID[i], quantity[i], color[i], capacity[i], totalPrice[i], orderID];
                sql = `INSERT INTO orderDetailsProduct (productID, quantity, color, capacity, totalPrice, orderID) VALUES (?, ?, ?, ?, ?, ?)`; // Thêm dữ liệu vào bảng orderDetailsProduct
                mysql.query(sql, values, (err, result) => {
                    if (err) throw err;

                    // Tăng biến đếm
                    count++;

                    // Nếu tất cả sản phẩm đã được lưu
                    if (count === product.length) {
                        // xử lý thanh toán VNPay
                        if(secureHash === signed){
                            res.cookie("paymentSuccess", "true");
                            res.redirect(`${process.env.CLIENT_URL}/success`);
                        } else{
                            res.send('Order details added...');
                        }
                    }
                });
            }
        });
    }

    async Vnpay_ipn(req, res){
        let vnp_Params = req.query;
        console.log("ipn: " + vnp_Params);
        let secureHash = vnp_Params['vnp_SecureHash'];
        
        let orderId = vnp_Params['vnp_TxnRef'];
        let rspCode = vnp_Params['vnp_ResponseCode'];

        delete vnp_Params['vnp_SecureHash'];
        delete vnp_Params['vnp_SecureHashType'];

        vnp_Params = sortObject(vnp_Params);
        let config = require('../../config/default.json');
        let secretKey = config.vnp_HashSecret;
        let querystring = require('qs');
        let signData = querystring.stringify(vnp_Params, { encode: false });
        let crypto = require("crypto");     
        let hmac = crypto.createHmac("sha512", secretKey);
        let signed = hmac.update(new Buffer(signData, 'utf-8')).digest("hex");     
        
        let paymentStatus = '0'; // Giả sử '0' là trạng thái khởi tạo giao dịch, chưa có IPN. Trạng thái này được lưu khi yêu cầu thanh toán chuyển hướng sang Cổng thanh toán VNPAY tại đầu khởi tạo đơn hàng.
        //let paymentStatus = '1'; // Giả sử '1' là trạng thái thành công bạn cập nhật sau IPN được gọi và trả kết quả về nó
        //let paymentStatus = '2'; // Giả sử '2' là trạng thái thất bại bạn cập nhật sau IPN được gọi và trả kết quả về nó
        
        let checkOrderId = true; // Mã đơn hàng "giá trị của vnp_TxnRef" VNPAY phản hồi tồn tại trong CSDL của bạn
        let checkAmount = true; // Kiểm tra số tiền "giá trị của vnp_Amout/100" trùng khớp với số tiền của đơn hàng trong CSDL của bạn
        if(secureHash === signed){ //kiểm tra checksum
            if(checkOrderId){
                if(checkAmount){
                    if(paymentStatus=="0"){ //kiểm tra tình trạng giao dịch trước khi cập nhật tình trạng thanh toán
                        if(rspCode=="00"){
                            //thanh cong
                            //paymentStatus = '1'
                            // Ở đây cập nhật trạng thái giao dịch thanh toán thành công vào CSDL của bạn
                            res.status(200).json({RspCode: '00', Message: 'Success'})
                        }
                        else {
                            //that bai
                            //paymentStatus = '2'
                            // Ở đây cập nhật trạng thái giao dịch thanh toán thất bại vào CSDL của bạn
                            res.status(200).json({RspCode: '00', Message: 'Success'})
                        }
                    }
                    else{
                        res.status(200).json({RspCode: '02', Message: 'This order has been updated to the payment status'})
                    }
                }
                else{
                    res.status(200).json({RspCode: '04', Message: 'Amount invalid'})
                }
            }       
            else {
                res.status(200).json({RspCode: '01', Message: 'Order not found'})
            }
        }
        else {
            res.status(200).json({RspCode: '97', Message: 'Checksum failed'})
        }
    }

    async Post_querydr(req, res){
        process.env.TZ = 'Asia/Ho_Chi_Minh';
        let date = new Date();

        let config = require('../../config/default.json');
        let crypto = require("crypto");
        
        let vnp_TmnCode = config.vnp_TmnCode;
        let secretKey = config.vnp_HashSecret;
        let vnp_Api = config.vnp_Api;
        
        let vnp_TxnRef = req.body.orderId;
        let vnp_TransactionDate = req.body.transDate;
        
        let vnp_RequestId =moment(date).format('HHmmss');
        let vnp_Version = '2.1.0';
        let vnp_Command = 'querydr';
        let vnp_OrderInfo = 'Truy van GD ma:' + vnp_TxnRef;
        
        let vnp_IpAddr = req.headers['x-forwarded-for'] ||
            req.connection.remoteAddress ||
            req.socket.remoteAddress ||
            req.connection.socket.remoteAddress;

        let currCode = 'VND';
        let vnp_CreateDate = moment(date).format('YYYYMMDDHHmmss');
        
        let data = vnp_RequestId + "|" + vnp_Version + "|" + vnp_Command + "|" + vnp_TmnCode + "|" + vnp_TxnRef + "|" + vnp_TransactionDate + "|" + vnp_CreateDate + "|" + vnp_IpAddr + "|" + vnp_OrderInfo;
        
        let hmac = crypto.createHmac("sha512", secretKey);
        let vnp_SecureHash = hmac.update(new Buffer(data, 'utf-8')).digest("hex"); 
        
        let dataObj = {
            'vnp_RequestId': vnp_RequestId,
            'vnp_Version': vnp_Version,
            'vnp_Command': vnp_Command,
            'vnp_TmnCode': vnp_TmnCode,
            'vnp_TxnRef': vnp_TxnRef,
            'vnp_OrderInfo': vnp_OrderInfo,
            'vnp_TransactionDate': vnp_TransactionDate,
            'vnp_CreateDate': vnp_CreateDate,
            'vnp_IpAddr': vnp_IpAddr,
            'vnp_SecureHash': vnp_SecureHash
        };
        // /merchant_webapi/api/transaction
        axios({
            method: 'post',
            url: vnp_Api,
            data: dataObj,
            headers: {'Content-Type': 'application/json'}
        })
        .then(function (response) {
            console.log(response);
        })
        .catch(function (error) {
            console.error(error);
        });
    }

    async Post_refund(req, res){
        process.env.TZ = 'Asia/Ho_Chi_Minh';
        let date = new Date();

        let config = require('../../config/default.json');
        let crypto = require("crypto");
    
        let vnp_TmnCode = config.vnp_TmnCode;
        let secretKey = config.vnp_HashSecret;
        let vnp_Api = config.vnp_Api;
        
        let vnp_TxnRef = req.body.orderId;
        let vnp_TransactionDate = req.body.transDate;
        let vnp_Amount = req.body.amount *100;
        let vnp_TransactionType = req.body.transType;
        let vnp_CreateBy = req.body.user;
                
        let currCode = 'VND';
        
        let vnp_RequestId = moment(date).format('HHmmss');
        let vnp_Version = '2.1.0';
        let vnp_Command = 'refund';
        let vnp_OrderInfo = 'Hoan tien GD ma:' + vnp_TxnRef;
                
        let vnp_IpAddr = req.headers['x-forwarded-for'] ||
            req.connection.remoteAddress ||
            req.socket.remoteAddress ||
            req.connection.socket.remoteAddress;

        
        let vnp_CreateDate = moment(date).format('YYYYMMDDHHmmss');
        
        let vnp_TransactionNo = '0';
        
        let data = vnp_RequestId + "|" + vnp_Version + "|" + vnp_Command + "|" + vnp_TmnCode + "|" + vnp_TransactionType + "|" + vnp_TxnRef + "|" + vnp_Amount + "|" + vnp_TransactionNo + "|" + vnp_TransactionDate + "|" + vnp_CreateBy + "|" + vnp_CreateDate + "|" + vnp_IpAddr + "|" + vnp_OrderInfo;
        let hmac = crypto.createHmac("sha512", secretKey);
        let vnp_SecureHash = hmac.update(new Buffer(data, 'utf-8')).digest("hex");
        
        let dataObj = {
            'vnp_RequestId': vnp_RequestId,
            'vnp_Version': vnp_Version,
            'vnp_Command': vnp_Command,
            'vnp_TmnCode': vnp_TmnCode,
            'vnp_TransactionType': vnp_TransactionType,
            'vnp_TxnRef': vnp_TxnRef,
            'vnp_Amount': vnp_Amount,
            'vnp_TransactionNo': vnp_TransactionNo,
            'vnp_CreateBy': vnp_CreateBy,
            'vnp_OrderInfo': vnp_OrderInfo,
            'vnp_TransactionDate': vnp_TransactionDate,
            'vnp_CreateDate': vnp_CreateDate,
            'vnp_IpAddr': vnp_IpAddr,
            'vnp_SecureHash': vnp_SecureHash
        };
        
        axios({
            method: 'post',
            url: vnp_Api,
            data: dataObj,
            headers: {'Content-Type': 'application/json'}
        })
        .then(function (response) {
            // console.log(response);
        })
        .catch(function (error) {
            // console.error(error);
        });
    }

    //Thanh toán momo
    async Paymomo(request, response, next){
        var quantity = request.body.quantity;
        var productID = request.body.productID;
        var accessKey = 'F8BBA842ECF85';
        var secretKey = 'K951B6PE1waDMi640xX08PD3vg6EkVlz';
        var orderInfo = 'pay with MoMo';
        var partnerCode = 'MOMO';
        var redirectUrl = `${process.env.CLIENT_URL}/thanks`;
        var ipnUrl = 'https://webhook.site/b3088a6a-2d17-4f8d-a383-71389a6c600b';
        var requestType = "payWithMethod";
        var amount = request.body.amount;
        // console.log("amount: "+amount)
        var orderId = partnerCode + new Date().getTime();
        var requestId = orderId;
        var extraData ='';
        var paymentCode = 'T8Qii53fAXyUftPV3m9ysyRhEanUs9KlOPfHgpMR0ON50U10Bh+vZdpJU7VY4z+Z2y77fJHkoDc69scwwzLuW5MzeUKTwPo3ZMaB29imm6YulqnWfTkgzqRaion+EuD7FN9wZ4aXE1+mRt0gHsU193y+yxtRgpmY7SDMU9hCKoQtYyHsfFR5FUAOAKMdw2fzQqpToei3rnaYvZuYaxolprm9+/+WIETnPUDlxCYOiw7vPeaaYQQH0BF0TxyU3zu36ODx980rJvPAgtJzH1gUrlxcSS1HQeQ9ZaVM1eOK/jl8KJm6ijOwErHGbgf/hVymUQG65rHU2MWz9U8QUjvDWA==';
        var orderGroupId ='';
        var autoCapture =true;
        var lang = 'vi';

        // Kiểm tra số lượng sản phẩm hiện có
        let sql = `SELECT remaining_quantity_variant FROM product_variations WHERE product_id = ?`;

        let canBuy = true;

        // Duyệt qua mỗi productID trong mảng
        for (let i = 0; i < productID.length; i++) {
            let values = [productID[i]];

            // Sử dụng Promise để đảm bảo rằng truy vấn này hoàn thành trước khi tiếp tục
            const productResult = await new Promise((resolve, reject) => {
                mysql.query(sql, values, (err, result) => {
                    if (err) reject(err);
                    resolve(result);
                });
            });

            // Nếu số lượng mua hàng nhiều hơn số lượng sản phẩm hiện có
            if (quantity[i] > productResult[0].remaining_quantity_variant) {
                canBuy = false;
                return response.status(400).json("Số lượng sản phẩm không đủ");
            }
        }

        // Nếu số lượng mua hàng ít hơn hoặc bằng số lượng sản phẩm hiện có
        if (canBuy) {
            //before sign HMAC SHA256 with format
                //accessKey=$accessKey&amount=$amount&extraData=$extraData&ipnUrl=$ipnUrl&orderId=$orderId&orderInfo=$orderInfo&partnerCode=$partnerCode&redirectUrl=$redirectUrl&requestId=$requestId&requestType=$requestType
                var rawSignature = "accessKey=" + accessKey + "&amount=" + amount + "&extraData=" + extraData + "&ipnUrl=" + ipnUrl + "&orderId=" + orderId + "&orderInfo=" + orderInfo + "&partnerCode=" + partnerCode + "&redirectUrl=" + redirectUrl + "&requestId=" + requestId + "&requestType=" + requestType;
                //signature
                const crypto = require('crypto');
                var signature = crypto.createHmac('sha256', secretKey)
                    .update(rawSignature)
                    .digest('hex');

                //json object send to MoMo endpoint
                const requestBody = JSON.stringify({
                    partnerCode : partnerCode,
                    partnerName : "Test",
                    storeId : "MomoTestStore",
                    requestId : requestId,
                    amount : amount,
                    orderId : orderId,
                    orderInfo : orderInfo,
                    redirectUrl : redirectUrl,
                    ipnUrl : ipnUrl,
                    lang : lang,
                    requestType: requestType,
                    autoCapture: autoCapture,
                    extraData : extraData,
                    orderGroupId: orderGroupId,
                    signature : signature
                });
                //Create the HTTPS objects
                const https = require('https');
                const options = {
                    hostname: 'test-payment.momo.vn',
                    port: 443,
                    path: '/v2/gateway/api/create',
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Content-Length': Buffer.byteLength(requestBody)
                    }
                }
                //Send the request and get the response
                const paymentReq = https.request(options, res => {
                    let data = '';
                    
                    console.log(`Status: ${res.statusCode}`);
                    console.log(`Headers: ${JSON.stringify(res.headers)}`);
                    res.setEncoding('utf8');
                    res.on('data', (chunk) => {
                        data += chunk;
                    });
                    res.on('end', () => {
                        console.log('No more data in response.');
                        const body = JSON.parse(data);
                        // console.log('Body: ');
                        // console.log(body);
                        // console.log('payUrl: ');
                        // console.log(body.payUrl);
                        if (body.payUrl === undefined) {
                            response.json({ error: body.message });
                        } else {
                            response.json({ url: body.payUrl });
                        }
                    });
                })
                paymentReq.on('error', (e) => {
                    // console.log(`problem with request: ${e.message}`);
                });
                paymentReq.write(requestBody);
                paymentReq.end();
                // console.log("return: "+redirectUrl);
        }
    }
}
    function sortObject(obj) {
        let sorted = {};
        let str = [];
        let key;
        for (key in obj){
            if (obj.hasOwnProperty(key)) {
            str.push(encodeURIComponent(key));
            }
        }
        str.sort();
        for (key = 0; key < str.length; key++) {
            sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
        }
        return sorted;
    }

module.exports = new PayController();