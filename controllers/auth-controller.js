const { response } = require('express');
const { getJWT } = require('../helpers/jwt'); // npm i bcryptjs
const { googleVerify } =  require('../helpers/google-verify');
const { getMenuFrontend } = require('../helpers/frontend-menu');
const bcryptjs = require('bcryptjs');
const UserModel = require('../models/user');

exports.login = async (req, res = response) => {
    // const { email, passoword } = req.body;

    try {
        // check email
        const user = await UserModel.findOne({ email: req.body.email });

        if (!user) {
            return res.status(404).json({
                ok: false,
                msg: 'Email or Password invalid'
            });
        }

        // check password
        const validPassword = bcryptjs.compareSync(req.body.password, user.password); // Comparo el password encriptado de la req con el del usuario de la bd

        if (!validPassword) {
            return res.status(400).json({
                ok: false,
                msg: 'Email or Password invalid'

            });
        }

        // Generate JWT
        // El token generado se usará para validar las rutas en las cuales deben tener cierto tipo de protección o para que ciertos usuarios autenticados puedan ejecutarlas.
        const token = await getJWT(user.id); // Se le asigna el token al user logueado

        // Si pego el Token que me devuelve Postman en jwt.io , se vera el payload y la fecha de expiración seteada
        res.json({
            ok: true,
            token: token,
            menu: getMenuFrontend(user.role)
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Unexpected Error'
        });
    }
}

exports.googleSignIn = async (req, res = response) => {
    try {
        const { email, name, picture } = await googleVerify(req.body.token);

        const userDB = await UserModel.findOne({ email: email });
        let user;

        if (!userDB) {
            // El password no va a ser usado ya que se crea por medio de la cuenta de google, en el password del UserModel se agrega '@@@' simplemente para que no salte el error de la validación del password required.
            user = new UserModel({
                name: name,
                email: email,
                password: '@@@',
                img: picture,
                google: true,
            });
        } else {
            user = userDB;
            user.google = true;
        }

        await user.save();

        const token = await getJWT(user);

        res.status(200).json({
            ok: true,
            user,
            token,
            menu: getMenuFrontend(user.role)
        });

    } catch(error) {
        res.status(500).json({
            ok: false,
            msg: 'Google token invalid'
        });
    }
}

exports.validateToken = async (req, res = response) => {
    // Se valida el token para los guard de Angular
    const uid = req.uid;

    const [ user, token ] = await Promise.all([
        UserModel.findById(uid),
        getJWT(uid)
    ]);

    res.status(200).json({
        ok: true,
        token: token,
        user: user,
        menu: getMenuFrontend(user.role)
    });
}
