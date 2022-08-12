const { response } = require('express');
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

exports.updateMedic = (req, res = response) => {
    res.json({
        ok: true,
        msg: 'update medics'
    })
}

exports.daleteMedic = (req, res = response) => {
    res.json({
        ok: true,
        msg: 'dalete medics'
    })
}

