//Agregamos mongoose
const mongoose = require('mongoose')

//Agregamos el validador de mongoose-unique
const uniqueValidator = require('mongoose-unique-validator')

//Creamos el Schema
const Schema = mongoose.Schema

//Creamos es schema del usuario
let clientesSchema = new Schema({
    mesa: {
        type: Number,
        default: 0
    },
    mesero: {
        type: String,
        default: ''
    },
    fecha: {
        type: Date,
        default: new Date()
    },
    sucursal: {
        type: Schema.Types.ObjectId,
        ref: 'Sucursal'
    }
})

//Agregamos el plugin validador
clientesSchema.plugin(uniqueValidator, { message: '{PATH} debe de ser único' })

module.exports = mongoose.model('Clientes', clientesSchema)