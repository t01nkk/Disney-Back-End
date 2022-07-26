const { Router } = require('express');
const router = Router();
const { genPassword, validatePassword } = require('../passport/passwordUtils')
const { validateEmail } = require('../helpers/helpers');
const { User } = require('../db');
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");

router.post('/register', async (req, res) => {
    try {
        const { password, email } = req.body;
        const exists = await User.findOne({ where: { email: email } });
        if (exists) return res.status(401).send({
            success: false,
            message: 'This email is already registered'
        });

        if (!validateEmail(email)) return res.status(400).send({
            success: false,
            message: 'Invalid email format'
        });
        if (!validatePassword(password)) return res.status(400).send({
            success: false,
            message: 'Invalid password format (4-8 char, 1 upperCase, 1 number)'
        })
        const hashPass = genPassword(password)
        await User.create({
            email: email,
            password: hashPass
        })
        res.send({
            success: true,
            message: 'User registered successfully',
            user: email
        })
    } catch (err) {
        console.log('Here be error: ', err.message)
        res.send({ message: err.message })
    }
})

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email: email } });
    if (!user) {
        return res.status(401).send({
            success: false,
            message: "Invalid Email"
        })
    }
    if (!await bcrypt.compare(password, user.password)) {
        return res.status(401).send({
            success: false,
            message: "Invalid Password"
        })
    }
    payload = {
        email: user.email,
        id: user._id
    }
    const token = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "1d" })
    console.log(req.user)
    res.send({
        success: true,
        message: "Login successful",
        token: "Bearer " + token
    })

})


module.exports = router;