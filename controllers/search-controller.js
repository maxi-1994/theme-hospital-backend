const { response } = require('express');
const UserModel = require('../models/user');
const HospitalModel = require('../models/hospital');
const MedicModel = require('../models/medic');

exports.getAll = async (req, res = response) => {

    const search = req.params.search;
    const regexp = new RegExp(search, 'i'); // con esta regExp se le quita el case sensitive al param de la ruta.

    const [ users, hospital, medic ] = await Promise.all([
        UserModel.find({ name: regexp }),
        HospitalModel.find({ name: regexp }),
        MedicModel.find({ name: regexp }),
    ]);

    res.json({
        ok: true,
        users,
        hospital,
        medic
    });

}

exports.getColectionDocuments = async (req, res = response) => {
    const table = req.params.table;
    const search = req.params.search;
    const regexp = new RegExp(search, 'i'); // con esta regExp se le quita el case sensitive al param de la ruta.

    let data = [];

    switch (table) {
        case 'users':
            data = await UserModel.find({ name: regexp });
            break;
        case 'hospitals':
            data = await HospitalModel.find({ name: regexp })
                                                    .populate('user', 'name img');
            break;
        case 'medics':
            data = await MedicModel.find({ name: regexp })
                                                    .populate('user', 'name img')
                                                    .populate('hospital', 'name img');
            break;
           
        default:
            return res.status(400).json({
                ok: false,
                msg: 'The table must be users, medics or hospitals'
            });
    }

    res.json({
        ok: true,
        results: data,
    });

}