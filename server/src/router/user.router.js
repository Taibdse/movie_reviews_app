const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const gravatar = require('gravatar');
const User = require('../model/User');
const Movie = require('../model/Movie');
const ValidationUtils = require('../utils/validation');
const { API_SECRET_KEY } = require('../config/keys');
const { userErrors, movieErrors } = require('../common/errors');


router.post('/register', async (req, res) => {
    const { email, password } = req.body;
    const result = { success: false, errors: {} };

    if(!ValidationUtils.isValidEmail(email)){
        result.errors.email = userErrors.email
    }

    if(!ValidationUtils.isValidPassword(password)){
        result.errors.password = userErrors.password;
    }

    if(!ValidationUtils.isEmpty(result.errors)){
        return res.status(400).json(result);
    }

    const user = await User.findOne({ email });

    if (user) {
        result.errors.email_existed = userErrors.email_existed;
        return res.status(400).json(result);
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
  
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser
              .save()
              .then(user => {
                result.success = true;
                res.json(result);
              })
              .catch(err => console.log(err));
          });
        });
    }
});

router.post('/login', async (req, res) => {
    const result = { success: false, errors: {}, data: {} };
    const { email, password } = req.body;
    
  
    // Find user by email
    try {
        const user = await User.findOne({ email });
         // Check for user
        if (!user) {
            result.errors.user_notfound = userErrors.user_notfound;
            return res.status(404).json(result);
        }
  
      // Check Password
      const isMatch = await bcrypt.compare(password, user.password);
      if (isMatch) {
        
        // User Matched
        const payload = { id: user.id, email: user.email, avatar: user.avatar }; // Create JWT Payload

        // Sign Token
        jwt.sign(
            payload,
            API_SECRET_KEY,
            { expiresIn: 3600 * 20 },
            (err, token) => {
                
                result.success = true,
                result.data.token = 'Bearer ' + token;
                
                return res.status(200).json(result);
            }
        );
      } else {
        result.errors.invalid_login = userErrors.invalid_login;
        return res.status(400).json(result);
      }

    } catch (error) {
        console.log(error);
        result.errors.user_notfound = userErrors.user_notfound;
        return res.status(404).json(result);
    }
   
});

router.get(
    '/current',
    passport.authenticate('jwt', { session: false }),
    (req, res) => {
      res.json({
        id: req.user.id,
        email: req.user.email
      });
    }
);



module.exports = router;