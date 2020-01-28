const express = require('express');
const cors = require('cors');
const { connectMongoDB } = require('./src/config/db');
// const MovieService = require('./src/service/movie.service');


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

    //crawl data
    // Crawler.crawl();

    app.use('/api/movies', require('./src/router/movie.router'));

    app.get('/', (req, res) => {
        res.send('Hello world');
    });

    // insert ,movies, categories to database
    // MovieService.insertCrawledMovies();

    const PORT = process.env.PORT || 3001;

    app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
}

initializeServer();

