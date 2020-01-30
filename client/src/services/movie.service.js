import axios from 'axios';
import { API_ENDPOINT } from '../config/api';

class MovieService{
    static async getMovies({ keyword, page, itemsPerPage, category }){
        const url = API_ENDPOINT + `/movies/search/?keyword=${keyword}&category=${category}&page=${page}&itemsPerPage=${itemsPerPage}`
        return axios.get(url);
    }

    static async getMovieDetails(movieSlug){
        return axios.get(API_ENDPOINT + `/movies/movie-details/` + movieSlug);
    }

    static async rateMovie({ movieId, stars }){
        return axios.post(API_ENDPOINT + `/movies/rate-movie`, { movieId, stars });
    }

}

export default MovieService;