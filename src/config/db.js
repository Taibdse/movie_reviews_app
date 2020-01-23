const mongoose = require('mongoose');
const MONGO_URI = 'mongodb://admin:admin123@ds211829.mlab.com:11829/movie_review_db';

async function connectMongoDB(){
    return mongoose.connect(MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
}

module.exports = { connectMongoDB };