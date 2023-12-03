const express = require("express");
const router = express.Router();

const ListController = require("../app/controllers/List");
const passportConfig = require("../config/passport");

router.post("/add/:table", passportConfig.isAuthenticated, ListController.add);
router.post(
  "/delete/:table/:key",
  passportConfig.isAuthenticated,
  ListController.delete
);
router.get("/:table", passportConfig.isAuthenticated, ListController.get);
router.put(
  "/update/:table",
  passportConfig.isAuthenticated,
  ListController.update
);
module.exports = router;
