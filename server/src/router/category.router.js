const express = require('express');
const router = express.Router();
const CategoryController = require('../controller/category.controller');

router.get('/get-all', CategoryController.getAll);


module.exports = router;