const Movie = require('../model/Movie');
const FileUtils = require('../utils/file_utils');
const CategoryService = require('./category.service');
const { MOVIES_FILE_PATH, CATEGORIES_FILE_PATH } = require('../common/constants');
const StringUtils = require('../utils/strings');

class MovieService{
    static insertOne(movie){
        const newMovie = new Movie(movie);
        return newMovie.save();
    }

    static async insertMany(){
        const categories = FileUtils.readJsonFromFile(CATEGORIES_FILE_PATH);
        const movies = FileUtils.readJsonFromFile(MOVIES_FILE_PATH);

        // console.log(categories.length);
        // console.log(movies.length);

        categories.forEach(async (cate) => {
            const newCate = {
                title: cate.title,
                slug: StringUtils.getSlugFromCateLink(cate.link)
            }

            const insertedCategory = await CategoryService.insertOne(newCate);
            
            const movieList = movies.filter(movie => movie.categoryId == cate.id);

            const insertMoviesPromises = movieList.map(movie => {
                const { title1, title2, info, description, image, slug, link } = movie;
                
                
                const newMovie = {
                    title: {
                        vn: title1,
                        en: title2
                    },
                    info: { ...info, link },
                    description, image, slug: slug + '-' + Math.random().toFixed(8),
                    category: insertedCategory._id
                };

                return MovieService.insertOne(newMovie);
            });

            
            try {
                const res = await Promise.all(insertMoviesPromises);
                console.log(res);
            } catch (error) {
                console.log(error);
            }
        })

        
        // CategoryService
        // return Movie.insertMany(movies);
    }
}

module.exports = MovieService;