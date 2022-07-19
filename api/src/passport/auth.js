const LocalStrategy = require('passport-local').Strategy
const passport = require('passport');
const { User } = require('../db');
const bcrypt = require('bcrypt');

passport.use(new LocalStrategy(
    async (username, password, done) => {
        console.log('meow')
        try {
            const user = await User.findOne({ where: { email: username } });
            if (!user) { return done(null, false, { message: 'No user with this email' }); }
            if (!bcrypt.compare(password, user.password)) return done(null, false, { message: 'Pasword incorrect' });
            return done(null, user);
        } catch (err) {
            done(err)
        }
    }
));

passport.serializeUser((user, done) => {
    console.log('serializeUser', user) //usuario logueado
    console.log('soy userid', user.id) //id hgenerado en la tabla
    done(null, user.id)
})

passport.deserializeUser(async (id, done) => {
    console.log('soy userid deserialise', id) // recive id de la sesion 
    try {
        const UserId = await User.findByPk(id); // lo busacamos en la base de datos
        console.log('soy userid deserialise base', UserId)
        done(null, UserId) // devolvemos el usuario
    } catch (err) {
        done(err)
    }
})