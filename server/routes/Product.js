const express = require('express');
const router = express.Router();

const ProductControllers = require("../app/controllers/ProductControllers");

router.get('/products', ProductControllers.QueryProducts);
router.get('/detail/:id', ProductControllers.DetailProducts);
router.post('/Add', ProductControllers.Addproduct);
router.post('/Delete/:id', ProductControllers.Delete);
router.get('/json', ProductControllers.json);
module.exports = router;