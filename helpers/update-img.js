const fs = require('fs');

const UserModel = require('../models/user');
const HospitalModel = require('../models/hospital');
const MedicModel = require('../models/medic');

const deleteImg = (path) => {
    if (fs.existsSync(path)) {
        fs.unlinkSync(path);
    }
}

const updateImg = async (type, id, fileName) => {

    let oldPath = '';

    switch (type) {
        case 'users':
            const user = await UserModel.findById(id)
            if (!user) {
                console.log('User does not exist');
                return false;
            }

            // Si existe una imagen en el mismo path, se borra la vieja para luego guardar la nueva.
            oldPath = `./uploads/users/${user.img}`;
            deleteImg(oldPath);

            // Se guarda la img en la DB
            user.img = fileName;
            await user.save();
            return true;
        break;
        case 'hospitals':
            const hospital = await HospitalModel.findById(id)
            if (!hospital) {
                console.log('Hospital does not exist');
                return false;
            }

            // Si existe una imagen en el mismo path, se borra la vieja para luego guardar la nueva.
            oldPath = `./uploads/hospitals/${hospital.img}`;
            deleteImg(oldPath);

            // Se guarda la img en la DB
            hospital.img = fileName;
            await hospital.save();
            return true;
        break;
        case 'medics':
            const medic = await MedicModel.findById(id)
            if (!medic) {
                console.log('Medic does not exist');
                return false;
            }

            // Si existe una imagen en el mismo path, se borra la vieja para luego guardar la nueva.
            oldPath = `./uploads/medics/${medic.img}`;
            deleteImg(oldPath);

            // Se guarda la img en la DB
            medic.img = fileName;
            await medic.save();
            return true;
        break;
    }

}

module.exports = {
    updateImg
};