const express = require("express");
const router = express.Router();
const { upload, uploadMain } = require("../config/multer/upload_image_product");
const ProductControllers = require("../app/controllers/ProductControllers");

// action
router.post(
  "/Add",
  upload.any(),
  ProductControllers.Addproduct
);
router.delete("/delete/:id", ProductControllers.Delete);
router.put(
  "/update/:id",
  upload.fields([
    { name: "images", maxCount: 10 },
    { name: "main_image", maxCount: 1 },
  ]),
  ProductControllers.Update
);
router.post("/disable-and-enable", ProductControllers.disable);

// get data
router.get("/json", ProductControllers.json);
router.post("/cart", ProductControllers.GetProductCart);
router.post("/order/:id", ProductControllers.getProductOfOrder);
router.get("/productslaptop", ProductControllers.QueryProductsLaptop);
router.get("/newphone", ProductControllers.Newphone);
router.get("/newlaptop", ProductControllers.Newlaptop);
router.get("/productsPhone", ProductControllers.QueryProductsDienThoai);
router.get("/detail/:id", ProductControllers.DetailProducts);
router.get('/laptopbanchay', ProductControllers.topLaptop);
router.get('/dienthoaibanchay', ProductControllers.topDienthoai);

module.exports = router;
