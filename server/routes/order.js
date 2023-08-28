const express = require('express');
const router = express.Router();

const OrderController = require("../app/controllers/OrderController");



router.post('/order', OrderController.order);
// Trong routes.js hoặc tệp tương tự
router.get('/json', OrderController.json);

router.put(`/order/confirm/:id`, OrderController.confirmOrder);
router.put(`/order/cancel/:id`, OrderController.cancelOrder);


module.exports = router;