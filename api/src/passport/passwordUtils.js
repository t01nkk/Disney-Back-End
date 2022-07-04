const bcrypt = require('bcrypt');
/*-------------------------------------------------- */
/*------Funcion para Hash contraseñas----- */
function genPassword(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(15));
}
/*-------------------------------------------------- */
/*------Authorizacion de usuarios------------------ */
function auth(req, res, next) {
    console.log(req.isAuthenticated());
    return req.isAuthenticated() ? next() : res.redirect('/login')
}
module.exports = {
    genPassword,
    auth
}