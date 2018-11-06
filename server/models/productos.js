//Agregamos mongoose
const mongoose = require('mongoose')

//Agregamos el validador de mongoose-unique
const uniqueValidator = require('mongoose-unique-validator')

//Creamos el Schema
const Schema = mongoose.Schema

//Creamos es schema del usuario
let productosSchema = new Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es requerido']
    },
    precio: {
        type: Number,
        default: 0
    },
    cantidad: {
        type: Number,
        default: 0
    },
    sucursal: {
        type: Schema.Types.ObjectId,
        ref: 'Sucursal'
    }
})

//Agregamos el plugin validador
productosSchema.plugin(uniqueValidator, { message: '{PATH} debe de ser único' })

module.exports = mongoose.model('Productos', productosSchema)