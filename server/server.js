const express = require('express');
const cors = require('cors');
const passport = require('passport');
const { connectMongoDB } = require('./src/config/db');
const movieRoutes = require('./src/router/movie.router');
const userRoutes = require('./src/router/user.router');
const configPassport = require('./src/config/passport');

async function initializeServer(){

    //database connection
    try {
        await connectMongoDB();
        console.log('DB connected');
    } catch (error) {
        console.log(error);
        process.exit(1);
    }


    const app = express();

    app.use(cors());
    app.use(express.urlencoded({ extended:false }));
    app.use(express.json());

    // Passport middleware
    app.use(passport.initialize());

    // Passport Config
    configPassport(passport);
    

    //app routes
    app.use('/api/movies', movieRoutes);
    app.use('/api/users', userRoutes);


    //crawl data
    // Crawler.crawl();

    // insert ,movies, categories to database
    // MovieService.insertCrawledMovies();

    const PORT = process.env.PORT || 3001;

    app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
}

initializeServer();

