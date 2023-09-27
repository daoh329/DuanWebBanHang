const express = require('express');
const router = express.Router();
const {upload} = require('../config/multer/upload_image_product');
const ProductControllers = require("../app/controllers/ProductControllers");

router.get('/productslaptop', ProductControllers.QueryProductsLaptop);
router.get('/productsPhone', ProductControllers.QueryProductsDienThoai);
router.get('/detail/:id', ProductControllers.DetailProducts);
router.post('/Add', upload.array('images', 10), ProductControllers.Addproduct);
router.post('/delete/:id', ProductControllers.Delete);
router.get('/json', ProductControllers.json);
router.get('/brands', ProductControllers.getBrand);
router.post('/disable-and-enable', ProductControllers.disable);
module.exports = router;