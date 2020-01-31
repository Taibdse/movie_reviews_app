const CommentService = require('../service/comment.service');

class CommentController{
    static async getCommentsByMovieId(req, res){
        let { movieId, page, itemsPerPage } = req.query;
        page = +page;
        itemsPerPage = +itemsPerPage;
        const result = await CommentService.getComments({ movieId, page, itemsPerPage });
        res.status(200).json(result);
    }

    static async addComment(req, res){
        const { movieId, content } = req.body;
        const result = await CommentService.addComment({ movieId, user: req.user, content });
        return res.status(200).json(result);
    }

    static async addReaction(req, res){
        const { commentId } = req.body;
        const { type } = req.params;
        const result = await CommentService.addReaction({ commentId, type, user: req.user });
        res.status(200).json(result);
    }
}

module.exports = CommentController;