const router = require('express').Router();
const { Op } = require('sequelize');
const { Film, Genre } = require('../db');
const { validateDate } = require('../helpers/helpers');
const passport = require('passport');

//LIST, FILTER AND ORDERS

router.get('/', async (req, res) => {
    const { name, idGenere, order } = req.query;

    try {

        // FIND BY NAME

        if (name) {
            const findMovie = await Film.findOne({
                where: {
                    tittle: {
                        [Op.iLike]: `${name}`
                    }
                },
                include: {
                    model: Genre,
                    attributes: ['name'],
                    through: { attributes: [] }
                }
            })
            if (findMovie) {
                return res.send(findMovie);
            }
            return res.status(404).send({ msg: `The movie ${name} doesn't exist` });
        }

        //FILTER BY GENRE

        if (idGenere) {
            var findByGenre = await Film.findAll({
                include: {
                    model: Genre,
                    where: { 'id': idGenere },
                    through: { attributes: [] }
                }
            })
            if (findByGenre) return res.send(findByGenre);
            return res.status(404).send({ msg: `The genre id: ${idGenere} doesn't exist` })
        }

        // ORDER BY CREATION DATE

        if (order === 'ASC' || order === 'DESC') {
            var orderBy = await Film.findAll({
                order: [['dateOfCreation', order]]
            })
            if (orderBy) {
                return res.send(orderBy);
            }
            return res.status(404).send({ msg: `Invalid Order: ${order}` });
        }

        //LIST MOVIES tittle, image, date

        const films = await Film.findAll({
            attributes: ['tittle', 'image', 'dateOfCreation']
        })

        if (films.length) return res.send(films);

        res.send({
            message: 'No movies have been created so far!'
        })
    } catch (err) {
        res.send({ msg: err.message });
    }
})

//*******************************************/
//***************Create**********************/
//*******************************************/

router.post('/', passport.authenticate('jwt', { session: false }), async (req, res) => {
    const { tittle, date, rating, genre } = req.body;
    try {
        if (!tittle) return res.status(400).send({
            message: 'Tittle is required'
        });

        if (!rating < 6 && !rating > 0) return res.status(400).send({
            message: 'Rating must be a number betwin 1 & 5'
        });

        if (!validateDate(date)) return res.status(400).send({
            message: 'Date must have the format: YYYY/MM/DD'
        });

        if (!genre?.length) return res.status(400).send({
            message: 'Genre is required'
        });

        console.log(typeof findGenre)
        var newFilm = await Film.create({
            tittle,
            date,
            rating
        })

        for (var i = 0; i < genre.length; i++) {
            await Genre.findOrCreate({ where: { name: genre[i] } });
            let findGenre = await Genre.findOne({ where: { name: genre[i] } });
            newFilm.addGenre(findGenre)
        }

        res.send({
            message: 'Film created successfully'
        });
    } catch (err) {
        res.send({
            message: err.message
        });
    }
})

//*******************************************/
//***************Details(read)***************/
//*******************************************/

router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const findFilm = await Film.findByPk({
            id,
            include: {
                model: Genre,
                attributes: ['name'],
                through: { attributes: [] }
            }
        });
        if (findFilm) {
            return res.send(findFilm);
        }
        res.status(404).send({
            message: 'Film not found'
        });
    } catch (err) {
        res.send({
            message: err.message
        });
    }
})

//*******************************************/
//***************Update**********************/
//*******************************************/

router.patch('/:id', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        const { id, tittle, img, date, rating } = req.params;
        const find = await Film.findByPk(id);
        if (!find) return res.status(404).send({
            message: 'The film you are trying to modify does not exist'
        });
        await Film.update({
            tittle: tittle ? tittle : find.tittle,
            image: img ? img : find.image,
            dateOfCreation: date ? date : find.dateOfCreation,
            rating: rating ? rating : find.rating
        })
        res.send({
            message: 'Movie updated successfully'
        });
    } catch (err) {
        console.log(err.message);
        res.send({
            message: err.message
        });
    }
})

//*******************************************/
//***************Delete**********************/
//*******************************************/

router.delete('/:id', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        const { id } = req.params;
        const destroy = await Film.destroy({ where: { id: id } });
        if (destroy) return res.send({
            message: `Film id: ${id}, deleted successfully`
        });
        res.status(404).send({
            message: `Film id: ${id}, couldn't be found`
        });
    } catch (err) {
        res.send({
            message: err.message
        });
    }
})


module.exports = router;