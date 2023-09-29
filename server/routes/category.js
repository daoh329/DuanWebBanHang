const express = require('express');
const router = express.Router();

const categorycontroller = require("../app/controllers/Category");

router.post('/add', categorycontroller.add);
router.post('/delete/:id', categorycontroller.delete);
router.get('/', categorycontroller.get);
router.put('/update/:oldname', categorycontroller.update);
module.exports = router;