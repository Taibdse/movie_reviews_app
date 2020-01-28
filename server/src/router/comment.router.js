const express = require('express');
const router = express.Router();
const passport = require('passport');
const Comment = require('../model/Comment');
const Movie = require('../model/Movie');
const ValidationUtils = require('../utils/validation');
const { commentErrors } = require('../common/errors')

router.post('/add', passport.authenticate('jwt', { session: false }), async (req, res) => {
    
    const { movieId, content } = req.body;
    const result = { success: false, errors: {}, data: {} }

    if(!ValidationUtils.isValidStringLength(content, 5, 10000)){
        result.errors.content = 'Content is required and minlength is 5, maxlength is 10000 characters';
    }

    if(ValidationUtils.isEmpty(result.errors)){
        const movie_notfound = 'Movie not found';
        
        try {
            const movie = await Movie.findById(movieId);
            if(!movie) {
                result.errors.movie_notfound = movie_notfound;
                return res.status(200).json(result);
            } else {
                const comment = new Comment({
                    content,
                    user: req.user._id,
                    movie: movie._id
                });
                const newComment = await comment.save();
                result.success = true;
                result.data = newComment;
                return res.status(200).json(result);
            }
        } catch (error) {
            console.log(error);
            result.errors.movie_notfound = error.message;
        }
    }
    
    return res.status(200).json(result);

});

router.get('/:movieId', (req, res) => {

});

module.exports = router;