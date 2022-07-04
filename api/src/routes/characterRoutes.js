const router = require('express').Router();
const { Character, Movie } = require('../db');

//*******************************************/
//***************List**********************/
//*******************************************/

router.get('/', async (req, res) => {
    const { name, age, weight, movies } = req.query;
    try {
        // FILTER BY NAME
        if (name) {
            const findName = await Character.findOne({
                where: { name: name },
                include: {
                    model: Movie,
                    attributes: ['name'],
                    through: { attributes: [] }
                }
            });
            if (!findName) {
                return res.status(404).send({ msg: `The character name: ${name}, doesn't exist.` });
            }
            return res.send(findName);
        }

        //FILTER BY AGE

        if (age) {
            const findByAge = await Character.findAll({
                where: { age: age },
                include: {
                    model: Movie,
                    attributes: ['name'],
                    through: { attributes: [] }
                }
            })
            if (findByAge.length) {
                return res.send(findByAge);
            }
            return res.status(404).send({ msg: 'No characters with this age.' });
        }

        //FILTER BY WEIGHT

        if (weight) {
            const findByWeight = await Character.findAll({
                where: { weight: weight },
                include: {
                    model: Movie,
                    attributes: ['name'],
                    through: { attributes: [] }
                }
            })
            if (findByWeight.length) {
                return res.send(findByWeight);
            }
            return res.status(404).send({ msg: 'No characters with this weight.' });
        };
        const allChar = await Character.findAll();
        let listInfo = allChar.map(e => {
            return f = {
                name: e.name,
                image: e.image
            }
        })
        res.send(listInfo);
    } catch (err) {
        res.send({ msg: err.message });
    }
})

//*******************************************/
//***************Create**********************/
//*******************************************/

router.post('/', async (req, res) => {
    const { name, age, weight, story, image, movie } = req.body;
    let findMovie = await Movie.findOne({ where: { name: movie } })
    let newCharacter = await Character.create({
        name,
        age,
        weight,
        story,
        image
    });
    newCharacter.addMovie(findMovie);
})

//*******************************************/
//***************Details(read)***************/
//*******************************************/

router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params
        const findChar = await Character.findOne({
            where: {
                id: id
            },
            include: {
                model: Movie,
                attributes: ['name'],
                through: { attributes: [] }
            }
        });
        res.send(findChar)
    } catch (err) {
        res.send({ msg: err.message });
    }
})

//*******************************************/
//***************Update**********************/
//*******************************************/

router.patch('/:id', async (req, res) => {
    const { id } = req.params
    const { name, age, weight, story, image } = req.body;
    const findChar = await Character.update({ where: { id: id } })

    if (findChar) {
        const updateChar = await Character.update({
            name: name ? name : findChar.name,
            age: age ? age : findChar.age,
            weight: age ? weight : findChar.weight,
            story: age ? story : findChar.story
        }, { where: { id: id } });
    } else return res.status(404).send({ msg: `The character id: ${id}, doesn't exist.` });

    res.send({ msg: "Character Updated successfully" })

})

//*******************************************/
//***************Delete**********************/
//*******************************************/

router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await Character.destroy({ where: { id: id } });
        res.send({ msg: `Character id: ${id}, deleted successfully` });
    } catch (err) {
        res.send({ msg: err.message });
    }
})


module.exports = router;