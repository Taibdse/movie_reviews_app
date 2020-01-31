const express = require('express');
const router = express.Router();
const passport = require('passport');
const CommentController = require('../controller/comment.controller')

router.get('/', CommentController.getCommentsByMovieId)

router.post('/add', passport.authenticate('jwt', { session: false }), CommentController.addComment);

router.post('/react/:type', passport.authenticate('jwt', { session: false }), CommentController.addReaction);


module.exports = router;