const bcrypt = require('bcrypt');
/*-------------------------------------------------- */
/*------Funcion para Hash contraseñas----- */


function validatePassword(password) {
    if (!/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{4,16}$/.test(password)) return false;
    return true;
}

function genPassword(password) {
    const newPass = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
    return newPass;

}
module.exports = {
    validatePassword,
    genPassword
}