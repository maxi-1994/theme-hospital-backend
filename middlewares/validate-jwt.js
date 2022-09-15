const { response } = require('express');
const jwt = require('jsonwebtoken');

const validateJWT = (req, res = response, next) => {
    // Leer el token de los headers
    const token = req.header('x-token');

    if (!token) {
        res.status(401).json({
            ok: false,
            msg: 'There is no token in the request'
        });
    }

    try {

        /*
            Ejemplo: Si un user se loguea, la respuesta del authController.login devolverá un nuevo token para ese user logueado.
            Cuando se haga una petición GET para obtener la lista de todos los usuarios. Será requerido el token del usuario logueado
            para verificar si tiene los permisios correspondientes para obtener esa información.
            Esa verificación se valida a partir del middleware validate-token.js. Debe estar importado y declarado en las rutas correspondientes.
        */

        const tokenVerified = jwt.verify(token, process.env.JWT_SECRET);
        req.uid = tokenVerified.uid;

        // Si la validación es correcta, terminara o pasará a la siguiente con el next. En el caso de que no este el next. La validación nunca termina.
        next()

    } catch (error) {
        return res.status(401).json({
            ok: false,
            msg: 'Invalid token'
        });
    };
}

module.exports = {
    validateJWT
}