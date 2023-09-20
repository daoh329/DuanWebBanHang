const express = require('express');
const router = express.Router();

const categorycontroller = require("../app/controllers/Category");

router.post('/add', categorycontroller.add);
router.post('/delete/:id', categorycontroller.detele);
router.get('/get', categorycontroller.get);
router.put('/update/:id', categorycontroller.update);
module.exports = router;