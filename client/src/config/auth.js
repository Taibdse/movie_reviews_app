import axios from 'axios';
import jwtDecode from 'jwt-decode';
import ValidationUtils from '../utils/validation';

export const setAuthHeader = (token) => {
    if(ValidationUtils.isEmpty(token)){
        axios.defaults.headers.common['Authorization'] = null;
    } else {
        if(token.indexOf('Bearer ') !== 0 ) token = 'Bearer ' + token;
        axios.defaults.headers.common['Authorization'] = token;
    }
}

export const getTokenFromLocal = () => {
    const token = localStorage.getItem('jwt-token');
    return token;
}

export const saveTokenToLocal = (token) => {
    localStorage.setItem('jwt-token', token);
}

export const clearTokenFromLocal = () => {
    localStorage.removeItem('jwt-token');
}

export const getAuthUserInfo = () => {
    let token = getTokenFromLocal();
    try {
        const decoded = jwtDecode(token);
        return decoded;
    } catch (error) {
        return null;
    }
}
