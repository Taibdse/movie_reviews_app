const express = require('express');
const router = express.Router();
const Category = require('../model/Category');


router.get('/get-all', async (req, res) => {
    const categories = await Category.find({});
    const result = { success: true, data: categories };
    res.status(200).json(result);
    
});

router.get('/:movieId', (req, res) => {

});

module.exports = router;