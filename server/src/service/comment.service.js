
const Comment = require('../model/Comment');
const Movie = require('../model/Movie');
const ValidationUtils = require('../utils/validation');
const { commentErrors, movieErrors } = require('../common/errors');

class CommentService { 
    static async getComments({ movieId, page, itemsPerPage }){
        const result = { success: false, errors: {}, data: {} };

        const myPagingComments = { 
            totalItems: 0,
            page, itemsPerPage,
            data: []
        }

        try {
            const movie = await Movie.findById(movieId);

            if(!movie){
                result.errors.movie_notfound = movieErrors.notfound;
            } else {

                const count = await Comment.countDocuments({ 
                    movie: movie._id
                });
        
                if(count != 0) {
                    const skip = itemsPerPage * (page - 1);
        
                    const comments = await Comment.find(
                        { movie: movie._id }, 
                        null, 
                        { skip: skip, limit: itemsPerPage })
                        .populate('user', '_id email avatar')

        
                    myPagingComments.data = comments;
                    myPagingComments.totalItems = count;
                    
                    result.data = myPagingComments;
                }

                result.success = true;
            }
        } catch (error) {
            console.log(error);
            result.errors.movie_notfound = movieErrors.notfound;
        }

        return result;

    }

    static async addComment({ movieId, content, user }){
        const result = { success: false, errors: {}, data: {} }

        if(!ValidationUtils.isValidStringLength(content, 5, 10000)){
            result.errors.content = 'Content is required and minlength is 5, maxlength is 10000 characters';
        }

        if(ValidationUtils.isEmpty(result.errors)){
            try {
                const movie = await Movie.findById(movieId);
                if(!movie) {
                    result.errors.movie_notfound = movieErrors.notfound;
                } else {
                    const comment = new Comment({
                        content,
                        user: user._id,
                        movie: movie._id
                    });
                    const newComment = await comment.save();
                    result.success = true;
                    result.data = newComment;
                }
            } catch (error) {
                console.log(error);
                result.errors.movie_notfound = error.message;
            }
        }

        return result;
    }

    static async addReaction({ type, commentId, user }){
        const result = { success: false, errors: {}, data: {} };
        let toggleLike = false, toggleDislike = false;
    
        if(typeof type === 'string' && type.toLowerCase() === 'like') toggleLike = true;
        else if(typeof type === 'string' && type.toLowerCase() === 'dislike') toggleDislike = true;
        else {
            result.errors.reaction_type = commentErrors.reaction_type;
            return result;
        }
    
        try {
            const comment = await Comment.findById(commentId);
            if(!comment){
                result.errors.comment_notfound = commentErrors.notfound;
            } else {
                const likeIndex = comment.likes.findIndex(userId => userId.toString() === user.id);
                const dislikeIndex = comment.dislikes.findIndex(userId => userId.toString() === user.id);
                
                if(toggleLike){
                    if(likeIndex == -1) {
                        comment.likes.push(req.user._id);
                        if(dislikeIndex > -1) comment.dislikes.splice(dislikeIndex, 1);
                    } else {
                        comment.likes.splice(likeIndex, 1);
                    }
                } else if(toggleDislike){
                    if(dislikeIndex == -1) {
                        comment.dislikes.push(req.user._id);
                        if(likeIndex > -1) comment.likes.splice(likeIndex, 1);
                    } else {
                        comment.dislikes.splice(likeIndex, 1);
                    }
                }
    
                const updatedComment = await comment.save();
                result.success = true;
                result.data = updatedComment;
                
            }
        } catch (error) {
            console.log(error);
            result.errors.comment_notfound = commentErrors.notfound;
        }
        return result;
    }
}

module.exports = CommentService;