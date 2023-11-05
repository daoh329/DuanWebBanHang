const express = require('express');
const router = express.Router();

const PayController = require('../app/controllers/PayController');

router.post('/set_amount', PayController.Set_amount);
router.get('/create_payment_url', PayController.create_payment_url);
router.get('/orderlist', PayController.OrderList);
router.get('/querydr', PayController.Querydr);
router.get('/refund', PayController.Refund);
router.post('/create_payment_url', PayController.Post_create_payment);
router.get('/vnpay_return', PayController.Vnpay_return);
router.get('/vnpay_ipn', PayController.Vnpay_ipn);
router.post('/querydr', PayController.Post_querydr);
router.post('/refund', PayController.Post_refund);

router.post('/check-quantity', PayController.checkQuantity);

router.post('/paymomo', PayController.Paymomo);

module.exports = router;