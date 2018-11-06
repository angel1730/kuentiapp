//Agregamos mongoose
const mongoose = require('mongoose')

//Agregamos el validador de mongoose-unique
const uniqueValidator = require('mongoose-unique-validator')

//Creamos el Schema
const Schema = mongoose.Schema

//Creamos es schema del usuario
let ordenSchema = new Schema({
    producto: {
        type: Schema.Types.ObjectId,
        ref: 'Productos'
    },
    cliente: {
        type: Schema.Types.ObjectId,
        ref: 'Clientes'
    }
})

//Agregamos el plugin validador
ordenSchema.plugin(uniqueValidator, { message: '{PATH} debe de ser único' })

module.exports = mongoose.model('Ordenes', ordenSchema)