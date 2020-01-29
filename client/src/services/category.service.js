import axios from 'axios';
import { API_ENDPOINT } from '../config/api';

class CategoryService{
    static async getAll(){
        const url = API_ENDPOINT + `/categories/get-all`;
        return axios.get(url);
    }
}

export default CategoryService;