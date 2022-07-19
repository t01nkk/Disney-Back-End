const { Op } = require('sequelize');
const characters = require('../../jsons/characters.json')
const films = require('../../jsons/movies.json');
const { Character, Film, User } = require('../db');


// {
//     "tittle": "The Return of Jafar",
//         "dateOfCreation": "01/22/2022",
//             "rating": 5,
//                 "image": "https://w7.pngwing.com/pngs/34/292/png-transparent-sunglasses-thug-life-cool-miscellaneous-angle-white.png"
// },
const populateDb = async () => {
    films.map(e => { //Formating for Date field so sequelize accepts it
        let date = new Date(e.dateOfCreation).toISOString();
        e.dateOfCreation = date;
        return e;
    })
    await Film.bulkCreate(films);

    console.log("Films:", await Film.count())

    // var names = characters.map(e => {
    //     // console.log(e.name)
    //     return {
    //         name: e.name,
    //         image: e.image,
    //         age: e.age,
    //         weight: e.weight,
    //         story: e.story
    //     }
    // });
    for (var i = 0; i < characters.length; i++) {
        var newChar = await Character.create({
            name: characters[i].name,
            image: characters[i].image,
            age: characters[i].age,
            weight: characters[i].weight,
            story: characters[i].story
        })
        if (characters[i].films.length) {
            for (var j = 0; j < characters[i].films.length; j++) {
                var findMovie = await Film.findOne({ where: { tittle: characters[i].films[j] } })
                if (findMovie) {
                    newChar.addFilm(findMovie)
                }
            }
        }

    }
    // await Character.bulkCreate(names, {
    //     include: [Film]
    // });
    console.log("Characters: ", await Character.count())
    // console.log("Movies: ", await Film.count())
}

const manageOrder = (order, characters) => {

    switch (order) {
        case "ageUp": {
            return characters.sort((a, b) => b.age - a.age)
        };
        case "ageDown": {
            return characters.sort((a, b) => a.age - b.age)
        };
        case "weightUp": {
            return characters.sort((a, b) => b.weight - a.weight)
        };
        case "weightDown": {
            return characters.sort((a, b) => a.weight - b.weight)
        };
        case "nameUp": {
            return characters.sort((a, b) => a.name.localeCompare(b.name))
        };
        case "nameDown": {
            return characters.sort((a, b) => b.name.localeCompare(a.name))
        };
        default: return characters;
    }
}

const manageOrderMovies = (order, movies) => {
    switch (order) {
        case "nameUp": {
            return movies.sort((a, b) => a.name.localeCompare(b.name))
        };
        case "nameDown": {
            return movies.sort((a, b) => b.name.localeCompare(a.name))
        };
        default: return movies;
    }
}

const validateDate = (date) => {
    if (/^\d{4}\/(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])$/.test(date)) return true;
    return false;
}

function validateEmail(email) {
    if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) return false;
    return true;
}

const findUser = async (user) => {
    const findUser = await User.findOne({ where: { email: user } });
    if (findUser) return true;
    return false;
}

module.exports = {
    validateEmail,
    findUser,
    populateDb,
    manageOrder,
    manageOrderMovies,
    validateDate
}

