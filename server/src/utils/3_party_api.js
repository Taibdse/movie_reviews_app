const axios = require('axios');
const MOVIEDB_API_KEY = '94212f0e92717193c4fba6771b315e54';
const PREFIX_API_URL = '`https://api.themoviedb.org/3';

async function getCategories(){
    const res = await axios.get(`${PREFIX_API_URL}/genre/movie/list?api_key=${MOVIEDB_API_KEY}&language=vi-VN`)
    return res.data.genres;
}

async function getMoviesByCategory(categoryId){
    
}
 

module.exports = { getCategories };