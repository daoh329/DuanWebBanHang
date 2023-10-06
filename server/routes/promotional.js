const express = require('express');
const router = express.Router();

const promotionalController = require("../app/controllers/PromotionalController");
router.post('/add', promotionalController.add);
router.post('/delete/:id', promotionalController.delete);
router.get('/json', promotionalController.get);
router.put('/update/:id', promotionalController.update);
module.exports = router;