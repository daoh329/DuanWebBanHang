const express = require('express');
const router = express.Router();

const colorcontroller = require("../app/controllers/Color");

router.post('/Add', colorcontroller.add);
router.post('/delete/:name', colorcontroller.delete);
router.get('/get', colorcontroller.get);
router.put('/update/:oldname', colorcontroller.update);
module.exports = router;