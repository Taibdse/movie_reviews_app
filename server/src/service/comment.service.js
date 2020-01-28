const Comment = require('../model/Comment');

class CommentService { 
    static insertOne(comment){
        const comment = new Comment(comment);
        return comment.save();
    }

    static getByMovieId(movieId){
        return Comment.find({ movie: movieId });
    }

    static async addLike(commentId, userId){
        const comment = await Comment.findById(commentId);
        if(comment != null) {
            const alreadyLiked = comment.likes.some(userId => userId == userId);
            if(!alreadyLiked) comment.likes.push(userId);
            return comment.save();
        }
    }
}

module.exports = CommentService;