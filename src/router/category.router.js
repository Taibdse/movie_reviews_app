const express = require('express');
const router = express.Router();
const MovieService = require('../service/movie.service')

router.post('/', (req, res) => {
    const category = req.body;
    MovieService.insertMovie()
});

router.get('/:movieId', (req, res) => {

});

module.exports = router;