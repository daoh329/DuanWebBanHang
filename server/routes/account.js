const express = require("express");
const router = express.Router();

const AccountControllers = require('../app/controllers/AccountControllers');
const passportConfig = require("../config/passport");

router.get("/list", passportConfig.isAuthenticated, AccountControllers.getAllAccounts)


module.exports = router;