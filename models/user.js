/*
    Un Schema en Mongoose es una estructura JSON que contiene información acerca de las propiedades de un documento(colección/tabla).
    Puede también contener información acerca de las validaciones y de los valores por default, y si una propiedad en particular es requerida.
*/
const { Schema, model } = require('mongoose');

const userSchema = Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    img: {
        type: String,
    },
    role: { // adminRole - userRole
        type: String,
        required: true,
        default: 'USER_ROLE',
    },
    google: {
        type: Boolean,
        default: false,
    },
});

userSchema.method('toJSON', function() {
    const { __v, _id, password, ...object } = this.toObject();
    object.uid = _id;
    return object; 
});

/*
    - Cuando se necesita crear usuarios, es decir, un nuevo campo en la tabla, se va a necesitar exponer el siguiente model. Tendrá
      las intrucciones para operaciones CRUD.
    - Como 1er parametro va el nombre de la colección y como 2do param va el schema que debe respetar el model.
    - En el caso de que la colección no exista, se creará una nueva automaticamente.
*/
module.exports = model('User', userSchema);