const { User } = require('../db');
const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;
var opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.ACCESS_TOKEN_SECRET;

passport.use(new JwtStrategy(opts, async function (jwt_payload, done) {
    try {
        const user = await User.findOne({ where: { _id: jwt_payload.id } });
        if (user) {
            return done(null, user);
        } else {
            return done(null, false, { message: 'This user does not exist' });
        }
    } catch (err) {
        return done(err, false);
    }
}));

