const { response } = require('express');
const { getJWT } = require('../helpers/jwt');
const bcryptjs = require('bcryptjs');
const User = require('../models/user');

exports.getUsers = async (req, res) => {
    // Como 1er param se colocan llaves para especificar un filtro y como 2do para un string con solos los elementos que quiero trae.
    const users = await User.find({}, 'name email role google'); 

    res.json({
        ok: true,
        users
    });
}

exports.createUser = async (req, res = response) => {
    // const { name, password, email } = req.body;
    try {
        
        const emailExists = await User.findOne({ email: req.body.email });

        if (emailExists) {
            return res.status(400).json({
                ok: true,
                msg: 'The Email already exists'
            });
        }

        const user = new User(req.body); // Genera una nueva instancia de user model. es decir un nuevo usuario

        // Encriptar password
        const salt = bcryptjs.genSaltSync(); // genero data aleatoria
        user.password = bcryptjs.hashSync(req.body.password, salt); // encripto el password del req.body y envio la data aleatorio 

        await user.save();

        // Generate JWT
        const token = await getJWT(user.id)
  
        res.json({
            ok: true,
            user,
            token
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Unexpected Error'
        })
    }
}

exports.updateUser = async (req, res = response) => {
    // Traer el id por medio de la ruta 
    const uid = req.body.uid;

    try {

        const userDB = await User.findById(uid);

        if (!userDB) {
            return res.status(404).json({
                ok: false,
                msg: 'User does not exist'
            });
        }

        const { password, google, ...fields  } = req.body; // Desestructurando con SPREAD(...fields), obtengo un nuevo objeto llamado FIELDS, las props password y google no estaran en el objeto FIELDS. 

        if (userDB.email !== req.body.email) {
            const email = await User.findOne({ email: req.body.email });
            if (email) {
                return res.status(400).json({
                    ok: false,
                    msg: 'There is an user with that Email'
                });
            } 
        }

        fields.email = req.body.email;

        const userUpdated = await User.findByIdAndUpdate(uid, fields, { new: true }); // new: true indica que en la response me muestra el usuario actualizado, si no, muestra como estaba antes de hacer el update

        res.json({
            ok: true,
            userUpdated: userUpdated,
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Unexpected Error'
        });
    }
}

exports.deleteUser = async (req, res = response) => {
    const uid = req.params.id;

    try {
        const userDB = await User.findById(uid);

        if (!userDB) {
            return res.status(404).json({
                ok: false,
                msg: 'User does not exist'
            });
        }

        await User.findByIdAndDelete(uid);

        res.json({
            ok: true,
            msg: 'User deleted'
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Unexpected Error'
        });
    }
}