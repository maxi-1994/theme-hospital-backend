const { response } = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

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

        const tokenVerified = jwt.verify(token, process.env.JWT_SECRET); // Verifico a que usuario pertenece el token

        req.uid = tokenVerified.uid; // con la verificación obtengo el UID del usuario y lo envio en la request para luego, por ejemplo, validarlo en los guards de Angular.

        // Si la validación es correcta, terminara o pasará a la siguiente con el next. En el caso de que no este el next. La validación nunca termina.
        next()

    } catch (error) {
        return res.status(401).json({
            ok: false,
            msg: 'Invalid token'
        });
    };
}

const validateAdminRole = async (req, res = response, next) => {

    const uid = req.uid; // Se obtiene ya que queda establecido del validateJWT cuando se verifica el token.

    try {

        const userDB = await User.findById(uid);

        if (!userDB) {
            return res.status(404).json({
                ok: false,
                msg: 'User does not exist.'
            });
        }

        if (userDB.role !== 'ADMIN_USER') {
            return res.status(403).json({ // 403 -> unauthorized
                ok: false,
                msg: 'User unauthorized.'
            });
        }

        next(); // Si existe el user y es un admin, se ejecuta el next()

    } catch(error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Contact with the administrator'
        });
    }
}

const validateAdminRoleOrSameUser = async (req, res = response, next) => {

    const uid = req.uid; // Se obtiene ya que queda establecido del validateJWT cuando se verifica el token.
    const idFromParams = req.params.id;

    try {

        const userDB = await User.findById(uid);

        if (!userDB) {
            return res.status(404).json({
                ok: false,
                msg: 'User does not exist.'
            });
        }

        if (userDB.role !== 'ADMIN_USER' && uid !== idFromParams) { // En el caso de que sea USER_ROLE, que el ID del token y el ID de la ruta son iguales, quiere decir que el user quiere actualizar su información.
            return res.status(403).json({ // 403 -> unauthorized
                ok: false,
                msg: 'User unauthorized.'
            });
        }

        next(); // Si existe el user y es un admin, se ejecuta el next()

    } catch(error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Contact with the administrator'
        });
    }
}

module.exports = {
    validateJWT,
    validateAdminRole,
    validateAdminRoleOrSameUser
}