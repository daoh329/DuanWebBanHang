const express = require('express');
const router = express.Router();

const OrderController = require("../app/controllers/OrderController");



router.post('/order', OrderController.order);
// Trong routes.js hoặc tệp tương tự
const OrderController = require("../app/controllers/OrderController");
router.get('/order/json', OrderController.json);


module.exports = router;