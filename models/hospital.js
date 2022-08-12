const { Schema, model } = require('mongoose');

const hospitalSchema = Schema({
    name: {
        type: String,
        require: true,
    },
    img: {
        type: String,
    },
    user: {
        require: true, // Ningún hospital ser creado sin un usuario, es decir, se debe estar logueado para crear un hospital y enviar el user uid al hacer la creacióm
        type: Schema.Types.ObjectId, // Indica que va a haber una relacion entre este schema (hospitalSchema) con el schema indicado en la referencia, en este caso 'User' (userSchema)
        ref: 'User'
    }
},
// { collection: 'hospitales' } Cambia el nombre de la colección
);

hospitalSchema.method('toJSON', function() {
    const { __v, ...object } = this.toObject();
    return object; 
});

module.exports = model('Hospital', hospitalSchema);