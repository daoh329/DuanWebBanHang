const express = require('express');
const router = express.Router();

const ListController = require("../app/controllers/List");
router.post('/add/:table', ListController.add);
router.post('/delete/:table/:key', ListController.delete);
router.get('/:table', ListController.get);
router.put('/update/:table', ListController.update);
module.exports = router;