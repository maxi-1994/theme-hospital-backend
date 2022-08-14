const { response } = require('express');
const HospitalModel = require('../models/hospital');

exports.getHospitals = async (req, res = response) => {

    /*
        La función POPULATE() de Moongose permite llenar ciertas partes del documento desde otra coleccion.
        En este caso se hace referecia al schema de users desde hospitals.
        De esta manera además de mostrar el id del user que creó el hospital, mostrara el name y la img del mismo.
    */
    const hospitals = await HospitalModel.find()
                                        .populate('user', 'name img') // Como 1er param va el nombre de la colección.
                                                                      // Como 2do param van los campos que se desean mostrar de la colección.

    res.status(200).json({
        ok: true,
        hospitals
    });
}

exports.createHospital = async (req, res = response) => {
    // debo obtener el ID del usuario que esta creando el hospital. Ese ID lo obtengo del token. Ya que para crear un hospital el usuario debe estar loguado y validado.
    // user uid obtenido del token por medio del middleware validateJWT.
    const uid = req.uid

    // Se envia todo lo que esta en el body, en este caso solo el name + el uid del usuario aclarado en la propiedad requerida del hospitalShcema 'user'.
    const hospital = new HospitalModel({
        user: uid,
        ...req.body
    });

    try {
        const newHospital = await hospital.save();

        res.json({
            ok: true,
            hospital: newHospital
        });

    /* RESPUESTA 
        "ok": true,
        "hospital": {
            "name": "Hospital Italiano", // name del hospital
            "user": "62e9eb3da6c73f2cc8d26d4d", // UID del user que creó el hospital
            "_id": "62f473952776ebad16a249ab" // ID del hospital
        }
    */

    } catch(error) {
        res.status(500).json({
            ok: false,
            msg: 'unexpected error'
        });
    }

}

exports.updateHospital = async (req, res = response) => {

    const id = req.params.id;
    const uid = req.uid // uid del user obtenido del token. user que esta actualizando el hospital.

    try {
        const hospitalDB = await HospitalModel.findById(id);

        if (!hospitalDB) {
            return res.status(404).json({
                ok: true,
                msg: 'Hospital does not exist.'
            });
        }

        // ...req.body -> spread operator -> carga todos los campos de la request.
        const hospitalChanges = {
            ...req.body,
            user: uid
            
        };

        const hospitalUpdated = await HospitalModel.findByIdAndUpdate(id, hospitalChanges, { new: true });

        res.json({
            ok: true,
            msg: 'Hospital updated',
            hospitalUpdated
        })

        
    } catch(error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Unexpected error.',
        });
    }
}

exports.daleteHospital = async (req, res = response) => {

    const id = req.params.id;

    try {
        const hospitalDB = await HospitalModel.findById(id);

        if (!hospitalDB) {
            return res.status(404).json({
                ok: true,
                msg: 'Hospital does not exist.'
            });
        }

        await HospitalModel.findByIdAndDelete(id);

        res.json({
            ok: true,
            msg: 'The hospital was deleted.',
        })

        
    } catch(error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Unexpected error.'
        });
    }
}

