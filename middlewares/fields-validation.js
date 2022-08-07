const { response } = require('express');
const { validationResult } = require('express-validator');

const fieldsValidation = (req, res = response, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({
            ok: false,
            errors: errors.mapped()
        });
    }

    // El next() se llama en el caso de que un middleware pase la validación, seguirá con el otro.
    next();
}

module.exports = {
    fieldsValidation
}