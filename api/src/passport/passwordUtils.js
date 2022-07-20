const bcrypt = require('bcrypt');
/*-------------------------------------------------- */
/*------Funcion para Hash contraseñas----- */


function validatePassword(password) {
    if (!/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{4,16}$/.test(password)) return false;
    return true;
}

function genPassword(password) {
    const newPass = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
    console.log("here be password  ", newPass);
    return newPass;

}
/*-------------------------------------------------- */
/*------Authorizacion de usuarios------------------ */
function auth(req, res, next) {
    console.log("Authenticated: ", req.isAuthenticated());
    return req.isAuthenticated() ? next() : res.send({ msg: 'You need to be authenticated to access this route' });
}

function notAuth(req, res, next) {
    console.log("Authenticated: ", req.isAuthenticated());
    return !req.isAuthenticated() ? next() : res.send({ msg: 'You are still logged in' });
}
module.exports = {
    validatePassword,
    genPassword,
    auth,
    notAuth
}