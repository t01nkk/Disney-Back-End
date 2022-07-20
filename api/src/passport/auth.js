const LocalStrategy = require('passport-local').Strategy
const passport = require('passport');
const { User } = require('../db');
const bcrypt = require('bcrypt');


const authenticateUser = async (email, password, done) => {
    try {
        const user = await User.findOne({ where: { email: email } })

        if (!user) return done(null, false, { message: "No user with that email" });
        if (await bcrypt.compare(password, user.password)) {
            return done(null, user);
        } else return done(null, false, { message: "Password incorrect." })
    } catch (err) {
        return done(e);
    }

}
passport.use(new LocalStrategy({ usernameField: 'email' }, authenticateUser))

passport.serializeUser((user, done) => {
    // console.log('serializeUser', user) //usuario logueado
    // console.log('soy userid', user.id) //id hgenerado en la tabla
    done(null, user.id)
})

passport.deserializeUser(async (id, done) => {
    // console.log('soy userid deserialise', id) // recive id de la sesion 
    try {
        const UserId = await User.findByPk(id); // lo busacamos en la base de datos
        // console.log('soy userid deserialise base', UserId)
        done(null, UserId) // devolvemos el usuario
    } catch (err) {
        done(err)
    }
})

