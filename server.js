const express = require('express');
const cors = require('cors');
const { connectMongoDB } = require('./src/config/db');
const Crawler = require('./src/utils/crawler');
const app = express();

// connectMongoDB()
// .then(res => console.log('DB connected'))
// .catch(err => {
//     console.log(err);
//     process.exit(1);
// })

app.use(cors());
app.use(express.urlencoded({ extended:false }));
app.use(express.json());

//crawl data
// Crawler.crawlMovieDetails();
// Crawler.crawlCategories();
Crawler.crawlMovieListByCategory();

const PORT = process.env.PORT || 6000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));

