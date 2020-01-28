const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const gravatar = require('gravatar');
const User = require('../model/User');
const ValidationUtils = require('../utils/validation');
const { API_SECRET_KEY } = require('../config/keys');


router.post('/register', async (req, res) => {
    const { email, password } = req.body;
    const errors = {};

    if(!ValidationUtils.isValidEmail(email)){
        errors.email = 'Email is invalid!'
    }

    if(!ValidationUtils.isValidPassword(password)){
        errors.password = 'Password is required and minlength must be 4 characters';
    }

    if(!ValidationUtils.isEmpty(errors)){
        return res.status(400).json(errors);
    }

    const user = await User.findOne({ email });

    if (user) {
        errors.email = 'Email already exists';
        return res.status(400).json(errors);
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
              .then(user => res.json({ success: true }))
              .catch(err => console.log(err));
          });
        });
    }
});

router.post('/login', async (req, res) => {
    let errors = {};
    const { email, password } = req.body;
  
    // Find user by email
    try {
        const user = await User.findOne({ email });
         // Check for user
        if (!user) {
            errors.message = 'User not found';
            return res.status(404).json(errors);
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
            { expiresIn: 3600 },
            (err, token) => {
                res.json({
                    success: true,
                    token: 'Bearer ' + token
                });
            }
        );
      } else {
        errors.message = 'Email and password do not match';
        return res.status(400).json(errors);
      }

    } catch (error) {
        console.log(error);
        errors.message = 'User not found';
        return res.status(404).json(errors);
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