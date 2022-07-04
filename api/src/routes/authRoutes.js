const { Router } = require('express');
const router = Router();
const passport = require('passport');
const { auth, genPassword } = require('../passport/passwordUtils')
const { User } = require('../db');
/*-----------------------------------------------*/
/*-------------.... Ruotes....-------------------*/


router.get('/', (req, res, next) => {
    res.status(200).send('<h1>Home</h1><p>Please <a href="/SignIn">register</a></p>');
})
router.get('/SignIn', (req, res, next) => {
    const form = '<h1>Register Page</h1><form method="post" action="/SignIn">\
                    Enter Username:<br><input type="text" name="username">\
                    <br>Enter Password:<br><input type="password" name="password">\
                    <br><br><input type="submit" value="Submit"></form>';

    res.send(form)
})

router.post('/SignIn', async (req, res, next) => {
    const { username, user, name, password } = req.body;
    try {
        const userExist = await User.findOne({ where: { email: username } });
        if (!userExist) {
            await User.create({ email: username, user: user, name: name, password: genPassword(password) })
            res.redirect('/Profile/auth')
        } else {
            res.status(401).send('Username is already taken');
        }
    } catch (err) {
        next(err)
    }
});
// router.get('/Profile/auth', auth, (req, res, next) => {

//     res.send('<h1>You are authenticated</h1><p><a href="/logout">Logout and reload</a></p>');
// })

router.post('/login', passport.authenticate('local', {
    failureRedirect: '/login',
    successRedirect: '/Profile/auth'
})
);

router.get('/login', (req, res, next) => {
    const form = '<h1>Login Page</h1><form method="POST" action="/login">\
    Enter Username:<br><input type="text" name="username">\
    <br>Enter Password:<br><input type="password" name="password">\
    <br><br><input type="submit" value="Submit"></form>';
    res.send(form)
})

// router.get('/logout', auth, (req, res, next) => {
//     req.logout();
//     res.redirect('/login');
// });

/*-------------------------------------------------------------- */
/*-------------------------Emails------------------------------- */



module.exports = router;