const express = require('express');
const router = express.Router();
const passport = require('passport');
const MovieController = require('../controller/movie.controller');


router.get('/search', MovieController.searchMovies);

router.get('/movie-details/:movieSlug', MovieController.getMovieDetails);

router.post('/rate-movie', passport.authenticate('jwt', { session: false }), MovieController.rateMovie);

router.get('/insert-crawled-movies', MovieController.insertCrawledMovies);


module.exports = router;