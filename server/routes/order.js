const express = require('express');
const router = express.Router();

const OrderController = require("../app/controllers/OrderController");



router.post('/order', OrderController.order);
// Trong routes.js hoặc tệp tương tự
router.get('/json', OrderController.json);

router.post('/order/:id/confirm', OrderController.confirmOrder);
router.post('/order/:id/cancel', OrderController.cancelOrder);


module.exports = router;