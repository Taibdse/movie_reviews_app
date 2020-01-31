const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const gravatar = require('gravatar');
const User = require('../model/User');
const ValidationUtils = require('../utils/validation');
const { API_SECRET_KEY } = require('../config/keys');
const { userErrors } = require('../common/errors');

class UserService{
    static async register({ email, password }){
        const result = { success: false, errors: {} };
    
        if(!ValidationUtils.isValidEmail(email)){
            result.errors.email = userErrors.email
        }
    
        if(!ValidationUtils.isValidPassword(password)){
            result.errors.password = userErrors.password;
        }
    
        if(ValidationUtils.isEmpty(result.errors)){
            const user = await User.findOne({ email });
    
            if (user) {
                result.errors.email_existed = userErrors.email_existed;
            } else {
                const avatar = gravatar.url(email, {
                    s: '200', // Size
                    r: 'pg', // Rating
                    d: 'mm' // Default
                });
        
                const newUser = new User({
                    email: req.body.email,
                    avatar,
                    password: req.body.password
                });

                try {
                    const salt = await bcrypt.genSalt(10);
                    const hash = await bcrypt.hash(newUser.password, salt);
                    newUser.password = hash;
                    await newUser.save();
                    result.success = true;
                } catch (error) {
                    result.errors.server_error = error.message;
                }
            }
        }
        
        return result;
    }

    static async signToken({ payload }){
        return new Promise((resolve, reject) => {
            jwt.sign(
                payload,
                API_SECRET_KEY,
                { expiresIn: 3600 * 24 },
                (err, token) => {
                    if(err) return reject(err);
                    return resolve(token);
                }
            );
        })
    }

    static async login({ email, password }){
        const result = { success: false, errors: {}, data: {} };
      
        // Find user by email
        try {
            const user = await User.findOne({ email });
             // Check for user
            if (!user) {
                result.errors.user_notfound = userErrors.user_notfound;
                
            } else {
                 // Check Password
                const isMatch = await bcrypt.compare(password, user.password);
                if (isMatch) {
                    
                    // User Matched
                    const payload = { id: user.id, email: user.email, avatar: user.avatar }; // Create JWT Payload
            
                    // Sign Token
                    const token = await UserService.signToken({ payload });
                    result.success = true,
                    result.data.token = 'Bearer ' + token;

                } else {
                    result.errors.invalid_login = userErrors.invalid_login;
                }
            }
    
        } catch (error) {
            console.log(error);
            result.errors.server_error = error.message;
        }
    }
}

module.exports = UserService;