const router = require('express').Router();
const { reset } = require('nodemon');
const { Op, ValidationError } = require('sequelize');
const { Character, Film, Genre } = require('../db');
const { validateDate } = require('../Middlewares/middleware')

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

        // ORDER BY TITTLE

        if (order === 'ASC' || order === 'DESC') {
            var orderBy = await Film.findAll({
                order: [['tittle', order]]
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
        res.send(films);
    } catch (err) {
        res.send({ msg: err.message });
    }
})

//*******************************************/
//***************Create**********************/
//*******************************************/
// Imagen.
// ○ Título.
// ○ Fecha de creación.
// ○ Calificación (del 1 al 5).
router.post('/', async (req, res) => {
    const { tittle, date, rating, genre } = req.body;
    try {
        if (!tittle) return res.status(400).send({ msg: 'Tittle is required' });
        if (!rating < 6 && !rating > 0) return res.status(400).send({ msg: 'Rating must be a number betwin 1 & 5' });
        if (!validateDate(date)) return res.status(400).send({ msg: 'date input incorrect format' });
        if (!genre?.length) return res.status(400).send({ msg: 'Genre is required' });
        const findGenre = await Genre.findOne({ where: { name: genre } });
        if (!findGenre) return res.status(404).send({ msg: 'Genre not found' })
        var newFilm = await Film.create({
            tittle,
            date,
            rating
        })
        newFilm.addGenre(findGenre)
        res.send({ msg: 'Film created successfully' });
    } catch (err) {
        console.log(err.message);
        res.send({ msg: err.message });
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
        res.status(404).send({ msg: 'Film not found' });
    } catch (err) {
        res.send({ msg: err.message });
    }
})

//*******************************************/
//***************Update**********************/
//*******************************************/

router.patch('/:id', async (req, res) => {
    try {
        const { id, tittle, img, date, rating } = req.params;
        const find = await Film.findByPk(id);
        if (!find) return res.status(404).send({ msg: 'The film you are trying to modify does not exist' });
        await Film.update({
            tittle: tittle ? tittle : find.tittle,
            image: img ? img : find.image,
            dateOfCreation: date ? date : find.dateOfCreation,
            rating: rating ? rating : find.rating
        })
        res.send({ msg: 'Movie updated successfully' });
    } catch (err) {
        console.log(err.message);
        res.send({ msg: err.message });
    }
})

//*******************************************/
//***************Delete**********************/
//*******************************************/

router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const destroy = await Film.destroy({ where: { id: id } });
        if (destroy) return res.send({ msg: `Film id: ${id}, deleted successfully` });
        res.status(404).send({ msg: `Film id: ${id}, couldn't be found` });
    } catch (err) {
        res.send({ msg: err.message });
    }
})


module.exports = router;