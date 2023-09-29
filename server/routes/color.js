const express = require('express');
const router = express.Router();

const colorcontroller = require("../app/controllers/Color");

router.post('/add', colorcontroller.add);
router.post('/delete/:name', colorcontroller.delete);
router.get('/', colorcontroller.get);
router.put('/update/:oldname', colorcontroller.update);
module.exports = router;