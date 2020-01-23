const Category = require('../model/Category');

class CategoryService{
    static insertOne(cate){
        const cate = new Category(cate);
        return cate.save();
    }

    static getAll(){
        return Category.find({});
    }
}

module.exports = CategoryService;