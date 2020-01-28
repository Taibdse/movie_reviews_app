const express = require('express');
const router = express.Router();

const MovieService = require('../service/movie.service');
const FileUtils = require('../utils/file_utils');
const { CATEGORIES_FILE_PATH, MOVIES_FILE_PATH } = require('../common/constants')

router.get('/search', async (req, res) => {
    console.log(req.query);
    let { keyword, category, page, itemsPerPage } = req.query;
    page = Number(page);
    itemsPerPage = Number(itemsPerPage);

    const result = await MovieService.searchMovies({ keyword, category, page, itemsPerPage });
    // console.log(result)
    res.status(200).json(result);
});

router.get('/movie-details/:movieSlug', async (req, res) => {
    const { movieSlug } = req.params;
    const result = await MovieService.getMovieDetailsBySlug(movieSlug);
    res.status(200).json(result);
});

router.get('/insert-movies', (req, res) => {
    console.log(123);
    const data = FileUtils.readJsonFromFile(MOVIES_FILE_PATH);
    return res.json(JSON.parse(data));
});


module.exports = router;