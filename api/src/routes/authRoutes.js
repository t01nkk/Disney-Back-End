const { Router } = require('express');
const router = Router();
const passport = require('passport');
const { notAuth, auth, genPassword, validatePassword } = require('../passport/passwordUtils')
const { validateEmail } = require('../Middlewares/middleware');
const { User } = require('../db');

// router.get('/register', async (req, res) => {

// })

router.post('/register', async (req, res) => {
    try {
        const { password, email } = req.body;
        if (!validateEmail(email)) return res.status(404).send('Invalid email format');
        if (!validatePassword(password)) return res.status(400).send({ msg: 'Invalid password format (4-8 char, 1 upperCase, 1 number)' })
        const hashPass = genPassword(password)
        await User.create({
            email: email,
            password: hashPass
        })
        res.send({ msg: 'User registered successfully' })
    } catch (err) {
        console.log('Here be error: ', err.message)
        res.send({ msg: err.message })
    }
})

router.post('/login', passport.authenticate('local', {
    failureRedirect: '/user/login',
}, (req, res) => {
    console.log(req)
    res.send(req.user)
}))

//AUTHENTICATED

router.get('/auth', (req, res) => {
    res.send('you have been authenticated: ', req.user)
})

//FAIL TO AUTHENTICATE

router.get('/login', (req, res) => {
    res.send({ msg: "can't login" })
})

// router.post('/logout', async (req, res) => {

// })

router.get('/all', async (req, res) => {
    try {
        const allUsers = await User.findAll();
        res.send(allUsers);
    } catch (err) {
        console.log("Here be error all users: ", err.message)
        res.send({ msg: err.message });
    }
})

module.exports = router;