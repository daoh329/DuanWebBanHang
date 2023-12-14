const express = require("express");
const router = express.Router();

const AccountControllers = require('../app/controllers/AccountControllers');
const passportConfig = require("../config/passport");

router.get("/list", passportConfig.isAuthenticated, AccountControllers.getAllAccounts);
router.put("/up-permission", passportConfig.isAuthenticated, AccountControllers.upPermission);
router.put("/down-permission", passportConfig.isAuthenticated, AccountControllers.downPermission);


module.exports = router;