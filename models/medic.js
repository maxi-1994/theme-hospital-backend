const { Schema, model } = require('mongoose');

const medicSchema = Schema({
    name: {
        type: String,
        required: true,
    },
    img: {
        type: String,
    },
    user: {
        required: true, 
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    hospital: {
        required: true,
        type: Schema.Types.ObjectId,
        ref: 'Hospital'
    }
});

/*
    Al momento de crear un medico: 
    - se debe enviar el UID del usuario que lo esta creando.
    - se debe enviar _ID de algún hospital para que ese medico creado tenga un hospital asignado.
*/

medicSchema.method('toJSON', function() {
    const { __v, ...object } = this.toObject();
    return object; 
});

module.exports = model('Medic', medicSchema);