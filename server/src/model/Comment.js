const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CommentSchema = new Schema({
    content: {
        type: String,
        required: true,
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    movie: {
        type: Schema.Types.ObjectId,
        ref: 'Movie',
        required: true,
    },
    likes: {
        type: [{
            type: Schema.Types.ObjectId,
            ref: 'User'
        }],
        required: true,
        default: []
    },
    dislikes: {
        type: [{
            type: Schema.Types.ObjectId,
            ref: 'User'
        }],
        required: true,
        default: []
    }
}, { timestamps: true })

const Comment = mongoose.model('Comment', CommentSchema);

module.exports = Comment;