//Agregamos mongoose
const mongoose = require('mongoose')

//Agregamos el validador de mongoose-unique
const uniqueValidator = require('mongoose-unique-validator')

//Creamos los roles validos
let rolesValidos = {
    values: ['ADMIN_ROLE', 'CLIENT_ROLE'],
    message: '{VALUE} no es un rol válido'
}

//Creamos el Schema
const Schema = mongoose.Schema

//Creamos es schema del usuario
let usuarioSchema = new Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es requerido']
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'El email es requerido']
    },
    password: {
        type: String,
        required: [true, 'El password es necesaria']
    },
    token: {
        type: String,
        default: ''
    },
    role: {
        type: String,
        default: 'CLIENT_ROLE',
        enum: rolesValidos
    },
    estado: {
        type: Boolean,
        default: true
    }
})

//Quitamos el campo de password para que no lo regrese y no lo muestre
usuarioSchema.methods.toJSON = function() {
    let user = this
    let userObject = user.toObject()
    delete userObject.password
    return userObject
}

//Agregamos el plugin validador
usuarioSchema.plugin(uniqueValidator, { message: '{PATH} debe de ser único' })

module.exports = mongoose.model('Usuario', usuarioSchema)