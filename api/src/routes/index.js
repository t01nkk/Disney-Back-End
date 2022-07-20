const router = require('express').Router();
const Character = require('./characterRoutes');
const Movie = require('./movieRoutes');;
const Auth = require('./authRoutes');

router.use('/characters', Character);
router.use('/user', Auth);
router.use('/movies', Movie);


module.exports = router;
