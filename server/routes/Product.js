const express = require("express");
const router = express.Router();
const { upload, uploadMain } = require("../config/multer/upload_image_product");
const ProductControllers = require("../app/controllers/ProductControllers");
const passportConfig = require("../config/passport");

// action
router.post(
  "/Add",
  passportConfig.isAuthenticated,
  upload.any(),
  ProductControllers.Addproduct
);
router.delete(
  "/delete/:id",
  passportConfig.isAuthenticated,
  ProductControllers.Delete
);
router.put(
  "/update/:id",
  passportConfig.isAuthenticated,
  upload.fields([
    { name: "images", maxCount: 10 },
    { name: "main_image", maxCount: 1 },
  ]),
  ProductControllers.Update
);
router.post("/disable-and-enable", passportConfig.isAuthenticated, ProductControllers.disable);

// get data
router.get("/json", passportConfig.isAuthenticated, ProductControllers.json);
router.post("/cart", ProductControllers.GetProductCart);
router.post(
  "/order/:id",
  passportConfig.isAuthenticated,
  ProductControllers.getProductOfOrder
);
router.get(
  "/productslaptop",
  ProductControllers.QueryProductsLaptop
);
router.get("/newphone", ProductControllers.Newphone);
router.get("/newlaptop", ProductControllers.Newlaptop);
router.get("/productsPhone", ProductControllers.QueryProductsDienThoai);
router.get("/detail/:id", ProductControllers.DetailProducts);
router.get("/laptopbanchay", ProductControllers.topLaptop);
router.get("/dienthoaibanchay", ProductControllers.topDienthoai);
router.post("/:id/variant", ProductControllers.getRemainingQuantityVariant); 
router.post("/ImgAndDescription",ProductControllers.getProductImageAndDescription);
router.get("/Description",ProductControllers.getProductDescription);
router.get("/:id/coupons", ProductControllers.getCoupons);

module.exports = router;
