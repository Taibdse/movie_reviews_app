const CategoryService = require('../service/category.service');

class CategoryController{
    static async getAll(req, res){
        const categories = await CategoryService.getAll();
        const result = { success: true, data: categories };
        res.status(200).json(result);
    }
}

module.exports = CategoryController;