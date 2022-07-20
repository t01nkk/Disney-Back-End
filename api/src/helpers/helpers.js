const validateDate = (date) => {
    if (/^\d{4}\/(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])$/.test(date)) return true;
    return false;
}

function validateEmail(email) {
    if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) return false;
    return true;
}

module.exports = {
    validateEmail,
    validateDate
}

