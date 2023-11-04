const express = require("express");
const router = express.Router();
const { upload, uploadMain } = require("../config/multer/upload_image_product");
const ProductControllers = require("../app/controllers/ProductControllers");

router.get("/productslaptop", ProductControllers.QueryProductsLaptop);
router.get("/newphone", ProductControllers.Newphone);
router.get("/newlaptop", ProductControllers.Newlaptop);
router.get("/productsPhone", ProductControllers.QueryProductsDienThoai);
router.get("/detail/:id", ProductControllers.DetailProducts);
router.post(
  "/Add",
  upload.fields([
    { name: "images", maxCount: 10 },
    { name: "main_image", maxCount: 1 },
  ]),
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
router.get("/json", ProductControllers.json);
router.get("/brands", ProductControllers.getBrands);
router.get("/colors", ProductControllers.getColors);
router.post("/disable-and-enable", ProductControllers.disable);
router.post("/cart", ProductControllers.GetProductCart);
module.exports = router;
