const express = require('express');
const router = express.Router();

const discountController = require("../app/controllers/PhieuGiamGiaController");
router.post('/add', discountController.add);
router.post('/setStatus/:id', discountController.setStaus);
router.get('/get', discountController.get);
router.put('/update/:id', discountController.update);
router.post('/addSanPhamDC', discountController.addSanPhamOnDiscountCode);
router.delete('/deleteSanPhamDC',discountController.deleteSanPhamOnDiscountCode);
router.get('/getSanPhamDC',discountController.getSanPhamOnDiscountCode);
router.get('/getSanPhamDCbyIdDC/:id',discountController.getSanPhamOnDiscountCodeByIdDiscountCode);
router.get('/getSanPhamDCbyIdSP/:id',discountController.getSanPhamOnDiscountCodeByIdSanPham);
module.exports = router;