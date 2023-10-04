const express = require('express');
const router = express.Router();
const {upload} = require('../config/multer/upload_image_product');
const ProductControllers = require("../app/controllers/ProductControllers");

router.get('/productslaptop', ProductControllers.QueryProductsLaptop);
router.get('/productsPhone', ProductControllers.QueryProductsDienThoai);
router.get('/detail/:id', ProductControllers.DetailProducts);
router.post('/Add', upload.array('images', 10), ProductControllers.Addproduct);
router.delete('/delete/:id', ProductControllers.Delete);
router.put('/update/:id', upload.array('images', 10), ProductControllers.Update);
router.get('/json', ProductControllers.json);
router.get('/brands', ProductControllers.getBrands);
router.post('/disable-and-enable', ProductControllers.disable);
module.exports = router;