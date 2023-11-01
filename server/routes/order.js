const express = require('express');
const router = express.Router();

const OrderController = require("../app/controllers/OrderController");

// router.post('/create_payment_url', OrderController.payment);
router.post('/pay', OrderController.order);
// Trong routes.js hoặc tệp tương tự
// router.get('/quanlyOrder', OrderController.quanlyOrder);
router.get('/quanlyAllOrder', OrderController.quanlyAllOrder);

router.get('/revenue', OrderController.Revenue);
router.get('/revenueDate', OrderController.RevenueDate);

router.get('/dashboard', OrderController.dashboard);
router.get('/orderDate', OrderController.orderDate);

router.put(`/confirm/:id`, OrderController.confirmOrder);
router.put(`/shipping/:id`, OrderController.shippingOrder);
router.put(`/delivered/:id`, OrderController.deliveredOrder);
router.put(`/deliveryfailed/:id`, OrderController.deliveryfailedOrder);
router.put(`/cancel/:id`, OrderController.cancel);

router.put(`/buyback/:id`, OrderController.buyback);
router.put(`/cancelorder/:id`, OrderController.cancelOrder);

router.get('/orderhistory/phone/:phone', OrderController.orderHistoryByPhone);
router.get('/orderhistory/id/:id', OrderController.orderHistoryById);

router.get('/laptopbanchay', OrderController.topLaptop);
router.get('/dienthoaibanchay', OrderController.topDienthoai);
router.get('/:id', OrderController.getProduct);

module.exports = router;