const Category = require('../model/Category');

class CategoryService{
    static insertOne(cate){
        const newCate = new Category(cate);
        return newCate.save();
    }

    static getAll(){
        return Category.find({});
    }
}

module.exports = CategoryService;