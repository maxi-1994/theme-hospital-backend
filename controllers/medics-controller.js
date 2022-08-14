const { response, json } = require('express');
const MedicModel = require('../models/medic');

exports.getMedics = async (req, res = response) => {
    const medics = await MedicModel.find()
                                    .populate('user', 'name img')
                                    .populate('hospital', 'name img');

    res.status(200).json({
        ok: true,
        medics
    });
}

exports.createMedic = async (req, res = response) => {

    const uidUser = req.uid;
    const idHospital = req.body.hospitalId;

    const medic = new MedicModel({
        user: uidUser,
        hospital: idHospital,
        ...req.body
    });
    
    try {

        const newMedic = await medic.save();

        res.status(200).json({
            ok: true,
            newMedic: newMedic,
        });

    } catch(error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Unexpected error',
        });

    }
}

exports.updateMedic = async (req, res = response) => {
    const id = req.params.id;
    const uid = req.uid;

    try {
        const medicDB = await MedicModel.findById(id);

        if (!medicDB) {
            res.status(404).json({
                ok: true,
                msg: 'The medic does not exist.',
            });
        }

        const medicChanges = {
            user: uid,
            hospital: medicDB.hospital,
            ...req.body
        };

        const medicUpdated = await MedicModel.findByIdAndUpdate(id, medicChanges, { new: true });

        res.status(200).json({
            ok: true,
            msg: 'Medic updated',
            medicUpdated
        });

    } catch(error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Unexpected error.'
        });
    }
}

exports.daleteMedic = async (req, res = response) => {
    const id = req.params.id;

    try {
        const medicDB = await MedicModel.findById(id);

        if (!medicDB) {
            res.status(404).json({
                ok: true,
                msg: 'The medic does not exist.',
            });
        }

        await MedicModel.findByIdAndDelete(id);

        res.status(200).json({
            ok: true,
            msg: 'Medic was deleted',
        });

    } catch(error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Unexpected error.'
        });
    }
}

