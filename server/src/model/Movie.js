const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// title, image, description, ratings, avgRate, info {director, actors, rated, start, duration}, category


// title1, title2,
// info: { directors, actors, country, start, duration, status },
// description, image,
// link: movie.link



const MovieSchema = new Schema({
    title: {
        type: {
            vn: String,
            en: String
        },
        required: true,
    },
    slug: {
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
    },
    ratings: {
        type: [{
            user: {
                type: Schema.Types.ObjectId,
                ref: 'User'
            },
            stars: {
                type: Number,
                default: 0,
                min: 0,
                max: 10
            },
        }],
        default: []
    },
    avgStars: {
        type: Number,
        min: 0,
        max: 10,
        default: 0
    },
    info: {
        type: {
            directors: String,
            actors: String,
            start: String,
            duration: String,
            status: String,
            country: String,
            link: String
        }
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: 'Category'
    }

})

const Movie = mongoose.model('Movie', MovieSchema);

module.exports = Movie;