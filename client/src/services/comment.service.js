import axios from 'axios';
import { API_ENDPOINT } from '../config/api';

class CommentService{
    static async getCommentsByMovieId(movieId){
        const url = API_ENDPOINT + `/comments?movieId=${movieId}`;
        return axios.get(url);
    }

    static async addComment({ movieId, content }){
        const url = API_ENDPOINT + `/comments/add`;
        return axios.post(url, { movieId, content });
    }

    static async react({ type, commentId }){
        const url = API_ENDPOINT + `/comments/react/${type}`;
        return axios.post(url, { commentId });
    } 
}

export default CommentService;