const express = require('express');
const router = express.Router();

const MovieService = require('../service/movie.service');
const FileUtils = require('../utils/file_utils');
const { CATEGORIES_FILE_PATH, MOVIES_FILE_PATH } = require('../common/constants')

router.post('/', (req, res) => {

});

router.get('/:movieId', (req, res) => {

});

router.get('/insert-movies', (req, res) => {
    console.log(123);
    const data = FileUtils.readJsonFromFile(MOVIES_FILE_PATH);
    return res.json(JSON.parse(data));
});


module.exports = router;