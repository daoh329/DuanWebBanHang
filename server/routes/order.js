const express = require('express');
const router = express.Router();

const OrderController = require("../app/controllers/OrderController");

router.post('/order', OrderController.order);

module.exports = router;