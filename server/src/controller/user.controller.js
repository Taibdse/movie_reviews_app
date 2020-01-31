const UserService = require('../service/user.service');

class UserController {
    static async register(req, res){
        const { email, password } = req.body;
        const result = await UserService.register({ email, password });
        res.status(200).json(result);
    }

    static async login(req, res){
        const { email, password } = req.body;
        const result = await UserService.login({ email, password });
        return res.status(200).json(result);
    }

    static async getCurrentUser(req, res){
        return res.json({
            id: req.user.id,
            email: req.user.email
        });
    }
}

module.exports = UserController;