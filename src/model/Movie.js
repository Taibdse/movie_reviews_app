const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MovieSchema = new Schema({
    title: {
        type: String,
        required: true,
        unique: true
    },
    image: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        minlength: 10,
        required: true,
    },
    ratings: [{
        user: Schema.Types.ObjectId,
        rate: {
            type: Number,
            default: 0,
            min: 0,
            max: 10
        },
        ref: 'User'
    }],
    avgRate: {
        type: Number,
        min: 0,
        max: 10,
        default:  0
    },
    info: {
        type: {
            director: String,
            actors: String,
            start: Date,
            duration: Number,
            rated: String
        }
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: 'Category'
    }

})

const Movie = mongoose.model('Movie', MovieSchema);

module.exports = Movie;