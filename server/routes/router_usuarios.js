const express = require('express')
const bcrypt = require('bcrypt') //Paquete para encriptar contraseñas
const Usuario = require('../models/usuario') //Importamos el modelo usuario

const { verificarToken, verificarAdminRole } = require('../middlewars/autenticacion') //Importamos archivos de middlewars
const _ = require('underscore') //Para funciones de javascript

const app = express()

//Rutas
app.get('/usuarios', (req, res) => {
    //Obtenemos todos los usuarios con find
    let desde = req.query.desde || 0
    desde = Number(desde)

    let limite = req.query.limite
    limite = Number(limite)

    //Usuario.find({ google: true }) --> podemos enviarle condiciones para la consulta
    //El segundo parametro es para decirle que campos queremos que nos regrese
    //estador : true -> para decirle que solo los que tienen estado true
    Usuario.find({}, 'nombre email estado role')
        .skip(desde) //Para poner de donde quiere empezar
        .limit(limite) //Cantidad de registros que quiere ver
        .sort({ nombre: 1 }) //Para odenar los datos [1 Ascendente -1 Descendente]
        .exec((err, usuarios) => {
            if (err) {
                return res.status(200).json({
                    ok: false,
                    err
                })
            }

            //Usuario.count({ google: true }, (err, cantidad) => {
            /* Usuario.count({ estado: true }, (err, cantidad) => {
                 res.json({
                     ok: true,
                     usuarios,
                     cantidad
                 })
             })*/

            //De esta manera es mejor hacer la consulta del coun para saber cuantos hay
            //estado : true -poner en el primer {}
            Usuario.collection.countDocuments({}, {}, (err, cantidad) => {
                res.json({
                    ok: true,
                    usuarios,
                    cantidad
                })
            })

        })
})

app.post('/usuarios', verificarToken, (req, res) => {

    //Obtenemos los datos
    let body = req.body

    //Creamos un objeto para crear un usuario
    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    })

    //Guardamos en la base de datos
    usuario.save((err, usuarioDB) => {
        if (err) {
            return res.status(200).json({
                ok: false,
                err
            })
        }

        //Si no hay errores mostramos el usuario creado
        res.json({
            ok: true,
            usuario: usuarioDB
        })
    })
})

app.put('/usuarios/:id', verificarToken, (req, res) => {
    let id = req.params.id

    //Otra manera usando underscore
    let body = _.pick(req.body, ['nombre', 'role', 'password', 'estado'])
    if (body.password)
        body['password'] = bcrypt.hashSync(body.password, 10)

    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, usuarioDB) => {
        if (err) {
            return res.status(200).json({
                ok: false,
                err
            })
        }
        res.json({
            ok: true,
            usuario: usuarioDB
        })
    })
})

app.delete('/usuarios/:id', verificarToken, (req, res) => {
    let id = req.params.id

    //Eliminamos con 
    Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => { //--> esta es para eliminar todo el registro
        //Usuario.findByIdAndUpdate(id, { estado: false }, { new: true }, (err, usuarioBorrado) => { //con esta solo se actualiza
        if (err) {
            return res.status(200).json({
                ok: false,
                err
            })
        }

        //Checamos si existe el usuario
        if (!usuarioBorrado) {
            return res.status(200).json({
                ok: false,
                err: {
                    message: 'Usuario no encontrado'
                }
            })
        }

        res.json({
            ok: true,
            usuarioBorrado
        })
    })
})


module.exports = app