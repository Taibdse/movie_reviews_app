const Movie = require('../model/Movie');

class MovieService{
    static insertOne(movie){
        const movie = new Movie(movie);
        return movie.save();
    }

    static insertMany(movies){
        return Movie.insertMany(movies);
    }
}

module.exports = MovieService;