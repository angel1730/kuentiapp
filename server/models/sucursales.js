//Agregamos mongoose
const mongoose = require('mongoose')

//Agregamos el validador de mongoose-unique
const uniqueValidator = require('mongoose-unique-validator')

//Creamos el Schema
const Schema = mongoose.Schema

//Creamos es schema del usuario
let sucursalSchema = new Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es requerido']
    },
    direccion: {
        type: String,
        default: ''
    },
    tel: {
        type: String,
        default: ''
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario'
    }
})

//Agregamos el plugin validador
sucursalSchema.plugin(uniqueValidator, { message: '{PATH} debe de ser único' })

module.exports = mongoose.model('Sucursal', sucursalSchema)