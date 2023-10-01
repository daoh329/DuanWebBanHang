const express = require('express');
const router = express.Router();

const OrderController = require("../app/controllers/OrderController");

router.post('/create_payment_url', OrderController.payment);
router.post('/pay', OrderController.order);
// Trong routes.js hoặc tệp tương tự
router.get('/quanlyOrder', OrderController.quanlyOrder);

router.get('/dashboard', OrderController.dashboard);

router.put(`/confirm/:id`, OrderController.confirmOrder);
router.put(`/cancel/:id`, OrderController.cancelOrder);

router.get('/orderhistory/:phone', OrderController.orderHistory);
router.get('/laptopbanchay', OrderController.topLaptop);

module.exports = router;