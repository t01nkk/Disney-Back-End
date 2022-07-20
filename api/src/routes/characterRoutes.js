const router = require('express').Router();
const { Op } = require('sequelize');
const { Character, Film } = require('../db');
const { auth } = require('../passport/passwordUtils');

//*******************************************/
//***************List**********************/
//*******************************************/

//ORDER CHARACTERS BY AGE WEIGHT OR ALPHABETICAL ORDER

router.get('/', auth, async (req, res) => {
    const { name, age, weight, film } = req.query;

    try {

        // SEARCH NAME

        if (name) {
            var findName = await Character.findOne({
                where: { name: { [Op.iLike]: `%${name}%` } },
                include: {
                    model: Film,
                    attributes: ['tittle'],
                    through: { attributes: [] }
                }
            });
            if (!findName) {
                return res.status(404).send({ msg: `The character name: ${name}, doesn't exist.` });
            }
            return res.send(findName);
        }

        //FILTER BY FILM

        if (film) {
            var findByFilm = await Character.findAll({
                include: {
                    model: Film,
                    where: { 'tittle': film },
                    attributes: ['tittle']
                }
            })
            return res.send(findByFilm);
        }


        //FILTER BY AGE

        if (age) {
            var findByAge = await Character.findAll({
                where: { age: age },
                include: {
                    model: Film,
                    attributes: ['tittle'],
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
            var findByWeight = await Character.findAll({
                where: { weight: weight },
                include: {
                    model: Film,
                    attributes: ['tittle'],
                    through: { attributes: [] }
                }
            })
            if (findByWeight.length) {
                return res.send(findByWeight);
            }
            return res.status(404).send({ msg: 'No characters with this weight.' });
        };

        //LIST NAME AND IMAGE

        var allChar = await Character.findAll({
            attributes: ['name', 'image']
        });
        // if (order && order === "nameUp" || order === "nameDown") {
        //     return res.send(manageOrder(order, allChar));
        // }

        res.send(allChar);
    } catch (err) {
        res.send({ msg: err.message });
    }
})

//*******************************************/
//***************Create**********************/
//*******************************************/

//asuming [films] is an array of strings and they 
//have been selected from a list of already existing films.

router.post('/', auth, async (req, res) => {
    const { name, age, weight, story, image, films } = req.body;

    try {
        if (!name || !films) return res.status(400).send({ msg: 'missing information' });
        var lowerCaseName = name.toLowerCase().trim();
        const exists = await Character.findOne({ where: { name: { [Op.iLike]: `%${lowerCaseName}%` } } });
        if (!exists) {

            if (!films.length) return res.status(400).send({ msg: 'the films are required to create the character' });
            let newCharacter = await Character.create({
                name: lowerCaseName,
                age,
                weight,
                story,
                image
            });

            for (var i = 0; i < films.length; i++) {
                await Film.findOrCreate({ where: { tittle: films[i] } }); //JUST FOR TESTING PURPOSES.
                let foundFilm = await Film.findOne({ where: { tittle: films[i] } })
                newCharacter.addFilm(foundFilm)
            }

            return res.send({ msg: "Character created successfuly" });
        }
        res.status(400).send({ msg: `A character with the name ${lowerCaseName} already exists` });
    } catch (err) {
        console.log(err.message);
        res.send({ msg: err.message });
    }
})

//*******************************************/
//***************Details(read)***************/
//*******************************************/

router.get('/:id', auth, async (req, res) => {
    try {
        const { id } = req.params
        const findChar = await Character.findOne({
            where: {
                id: id
            },
            include: {
                model: Film,
                attributes: ['tittle'],
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

router.patch('/:id', auth, async (req, res) => {
    const { id } = req.params
    const { name, age, weight, story, image } = req.body;
    const findChar = await Character.update({ where: { id: id } })

    if (findChar) {
        await Character.update({
            name: name ? name : findChar.name,
            age: age ? age : findChar.age,
            weight: age ? weight : findChar.weight,
            story: age ? story : findChar.story,
            imgage: image ? image : findChar.image
        }, { where: { id: id } });

        return res.send({ msg: "Character Updated successfully" })
    }
    res.status(404).send({ msg: `The character id: ${id}, doesn't exist.` });


})

//*******************************************/
//***************Delete**********************/
//*******************************************/

router.delete('/:id', auth, async (req, res) => {
    try {
        const { id } = req.params;
        const destroy = await Character.destroy({ where: { id: id } });
        if (destroy) return res.send({ msg: `Character id: ${id}, deleted successfully` });

        res.status(404).send({ msg: `Character id: ${id}, coudn't be found` })
    } catch (err) {
        res.send({ msg: err.message });
    }
})


module.exports = router;