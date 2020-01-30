import axios from 'axios';
import { API_ENDPOINT } from '../config/api';

class UserService{
    static async login({ email, password }){
        const url = API_ENDPOINT + `/users/login`;
        return axios.post(url, { email, password });
    }
}

export default UserService;