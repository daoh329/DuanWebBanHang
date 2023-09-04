const express = require('express');
const router = express.Router();

const ProductControllers = require("../app/controllers/ProductControllers");

router.post('/Add', ProductControllers.Addproduct);
router.get('/json', ProductControllers.json);
module.exports = router;