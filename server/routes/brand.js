const express = require('express');
const router = express.Router();

const brandcontroller = require("../app/controllers/Brand");

router.post('/add', brandcontroller.add);
router.post('/delete/:name', brandcontroller.delete);
router.get('/', brandcontroller.get);
router.put('/update/:oldname', brandcontroller.update);
module.exports = router;