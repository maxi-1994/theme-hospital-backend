const { response } = require('express');
const { getJWT } = require('../helpers/jwt'); // npm i bcryptjs
const bcryptjs = require('bcryptjs');
const User = require('../models/user');


exports.login = async (req, res = response) => {
    // const { email, passoword } = req.body;

    try {
        // check email
        const userDB = await User.findOne({ email: req.body.email });

        if (!userDB) {
            return res.status(404).json({
                ok: false,
                msg: 'Email or Password invalid'
            });
        }

        // check password
        const validPassword = bcryptjs.compareSync(req.body.password, userDB.password); // Comparo el password encriptado de la req con el del usuario de la bd

        if (!validPassword) {
            return res.status(400).json({
                ok: false,
                msg: 'Email or Password invalid'

            });
        }

        // Generate JWT
        // El token generado se usará para validar las rutas en las cuales deben tener cierto tipo de protección o para que ciertos usuarios autenticados puedan ejecutarlas.
        const token = await getJWT(userDB.id);

        // Si pego el Token que me devuelve Postman en jwt.io , se vera el payload y la fecha de expiración seteada
        res.json({
            ok: true,
            msg: token
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Unexpected Error'
        });
    }
}