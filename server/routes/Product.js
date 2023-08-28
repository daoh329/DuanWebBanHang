const express = require('express');
const router = express.Router();

const ProductControllers = require("../app/controllers/ProductControllers");

router.post('/AddLaptop', ProductControllers.Addlaptop);

module.exports = router;