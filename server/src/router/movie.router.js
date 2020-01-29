const express = require('express');
const router = express.Router();
const passport = require('passport');
const Movie = require('../model/Movie');
const MovieService = require('../service/movie.service');
const ValidationUtils = require('../utils/validation');
const { userErrors, movieErrors } = require('../common/errors');

router.get('/search', async (req, res) => {
    console.log(req.query);
    let { keyword, category, page, itemsPerPage } = req.query;

    if(ValidationUtils.isEmpty(keyword)) keyword = '';
    if(ValidationUtils.isEmpty(category)) category = 'all';
    page = Number(page);
    itemsPerPage = Number(itemsPerPage);


    const data = await MovieService.searchMovies({ keyword, category, page, itemsPerPage });
    const result = { success: true, data: data };
    res.status(200).json(result);
});

router.get('/movie-details/:movieSlug', async (req, res) => {
    const { movieSlug } = req.params;
    const data = await MovieService.getMovieDetailsBySlug(movieSlug);
    const result = { success: true, data: data }
    res.status(200).json(result);
});


router.post('/rate-movie', passport.authenticate('jwt', { session: false }),
    async (req, res) => {
        const { movieId, stars } = req.body;
        const result = { success: false, errors: {}, data: {} };

        try {
            const movie = await Movie.findById(movieId);
            if(!movie){
                result.errors.movie_notfound = movieErrors.notfound;
            } else {
                if(!ValidationUtils.isValidNumberRangeValue(stars, 1, 10)){
                    result.errors.stars = userErrors.rate;
                }

                if(ValidationUtils.isEmpty(result.errors)){
                    let index = movie.ratings.findIndex(rates => rates.user.toString() === req.user.id);
                    if(index == -1){
                        movie.ratings.push({
                            user: req.user._id,
                            stars: parseInt(stars)
                        })
                    } else {
                        movie.ratings[index].stars = parseInt(stars);
                    }

                    const totalStars = movie.ratings.reduce((total, rate) => total + rate.stars, 0);
                    const avgStars = Number((totalStars/movie.ratings.length).toFixed(1));
                    movie.avgStars = avgStars;

                    const updatedMovie = await movie.save();

                    result.success = true;
                    result.data = updatedMovie;
                } 
            }
        } catch (error) {
            console.log(error);
            result.errors.movie_notfound = movieErrors.notfound;
        }

        res.status(200).json(result);
    }
);

router.get('/insert-crawled-movies', async (req, res) => {
    try {
        await MovieService.insertCrawledMovies();
        res.json({ success: true });
    } catch (error) {
        console.log(error);
        res.json({ success: false });
    }
});


module.exports = router;