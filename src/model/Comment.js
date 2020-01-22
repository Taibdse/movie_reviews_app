const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CommentSchema = new Schema({
    content: {
        type: String,
        required: true,
        unique: true,
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    movie: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Movie'
    },
    likes: {
        type: [{
            type: Schema.Types.ObjectId,
            ref: 'User'
        }],
        required: true,
        default: []
    }
})

const Comment = mongoose.model('Comment', CommentSchema);

module.exports = Comment;