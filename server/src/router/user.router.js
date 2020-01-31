const express = require('express');
const router = express.Router();
const passport = require('passport');
const UserControler = require('../controller/user.controller');


router.post('/register', UserControler.register);

router.post('/login', UserControler.login);

router.get('/current', passport.authenticate('jwt', { session: false }), UserControler.getCurrentUser);


module.exports = router;