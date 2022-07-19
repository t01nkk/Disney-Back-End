const router = require('express').Router();

const Character = require('./characterRoutes');
const Movie = require('./movieRoutes');
const Genre = require('./genreRoutes');
const Auth = require('./authRoutes');

router.use('/characters', Character);
router.use('/genres', Genre);
router.use('/user', Auth);
router.use('/movies', Movie);


module.exports = router;
