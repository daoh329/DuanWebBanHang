const express = require('express');
const router = express.Router();

const discountController = require("../app/controllers/PhieuGiamGiaController");
const passportConfig = require("../config/passport");

router.post('/add',passportConfig.isAuthenticated, discountController.add);
router.post('/setEnd/:id',passportConfig.isAuthenticated, discountController.setEnd);
router.get('/get', discountController.get);
router.put('/update/:id',passportConfig.isAuthenticated, discountController.update);
router.post('/addProduct',passportConfig.isAuthenticated, discountController.addSanPhamOnDiscountCode);
router.post('/deleteSanPhamDC',passportConfig.isAuthenticated,discountController.deleteSanPhamOnDiscountCode);
router.get('/getProductsbyIdDC/:id',discountController.getSanPhamOnDiscountCode);
router.get('/getProductsbyIdSP/:id',discountController.getSanPhamOnDiscountCodeByIdSanPham);
router.post('/check-unique', passportConfig.isAuthenticated, discountController.checkUnique);

module.exports = router;