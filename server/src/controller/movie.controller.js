const MovieService = require('../service/movie.service');
const ValidationUtils = require('../utils/validation');

class MovieController{
    
    static async searchMovies(req, res){
        let { keyword, category, page, itemsPerPage } = req.query;

        if(ValidationUtils.isEmpty(keyword)) keyword = '';
        if(ValidationUtils.isEmpty(category)) category = 'all';
        page = Number(page);
        itemsPerPage = Number(itemsPerPage);

        const data = await MovieService.searchMovies({ keyword, category, page, itemsPerPage });
        const result = { success: true, data: data };
        return res.status(200).json(result);
    }

    static async getMovieDetails(req, res){
        const { movieSlug } = req.params;
        const data = await MovieService.getMovieDetailsBySlug(movieSlug);
        const result = { success: true, data: data }
        return res.status(200).json(result);
    }

    static async rateMovie(req, res){
        const { movieId, stars } = req.body;
        const result = await MovieService.rateMovie({ movieId, stars, user: req.user });
        res.status(200).json(result);
    }

    static async insertCrawledMovies(req, res){
        try {
            await MovieService.insertCrawledMovies();
            res.json({ success: true });
        } catch (error) {
            console.log(error);
            res.json({ success: false });
        }
    }

}

module.exports = MovieController;