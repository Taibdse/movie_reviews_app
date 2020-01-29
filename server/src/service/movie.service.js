const Movie = require('../model/Movie');
const Category = require('../model/Category');
const FileUtils = require('../utils/file_utils');
const CategoryService = require('./category.service');
const { MOVIES_FILE_PATH, CATEGORIES_FILE_PATH } = require('../common/constants');
const StringUtils = require('../utils/strings');


class MovieService {
    static insertOne(movie){
        const newMovie = new Movie(movie);
        return newMovie.save();
    }

    static async searchMovies({ keyword, category, page, itemsPerPage }){
        
        let myPagingMovies = {
            page: page,
            itemsPerPage: itemsPerPage,
            totalItems: 0,
            data: [],
        }
        let foundCate = null;
        
        if(category != 'all') {
            try {
                foundCate = await Category.findById(category);
                if(foundCate == null) return myPagingMovies;
            } catch (error) {
                return myPagingMovies;
            }
        }

        
        

        const query = {
            $or: [
                { 'title.vn': { $regex: keyword, $options: 'gi' } },
                { 'title.en': { $regex: keyword, $options: 'gi' } }
            ],
            // category: category
        };

        if(category != 'all') query.category = category;

        const count = await Movie.countDocuments(query);

        if(count == 0){
            return myPagingMovies;
        } else {
            const skip = itemsPerPage * (page - 1);

            const movies = await Movie.find(query, null, { skip: skip, limit: itemsPerPage }).select('_id title avgStars image slug');
            myPagingMovies.data = movies;
            myPagingMovies.totalItems = count;

            return myPagingMovies;
        }
        
    }

    static async getMovieDetailsBySlug(movieSlug){
        const movie = await Movie.findOne({ slug: movieSlug }).populate('category');
        return movie;
    }

    static async insertCrawledMovies(){
        await Movie.deleteMany({});
        await Category.deleteMany({});

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
                await Promise.all(insertMoviesPromises);
            } catch (error) {
                console.log(error);
            }
        })

        
        // CategoryService
        // return Movie.insertMany(movies);
    }
}

module.exports = MovieService;