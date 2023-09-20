const express = require('express');
const router = express.Router();
const {upload} = require('../config/multer/upload_image_product');
const ProductControllers = require("../app/controllers/ProductControllers");

router.get('/products', ProductControllers.QueryProducts);
router.get('/detail/:id', ProductControllers.DetailProducts);
router.post('/Add', upload.array('images', 10), ProductControllers.Addproduct);
router.post('/Delete/:id', ProductControllers.Delete);
router.get('/json', ProductControllers.json);
router.get('/brands', ProductControllers.getBrand);
module.exports = router;