const express = require('express')
const bcrypt = require('bcrypt') //Paquete para encriptar contraseñas
const Sucursales = require('../models/sucursales') //Importamos el modelo sucursal

const { verificarToken, verificarAdminRole } = require('../middlewars/autenticacion') //Importamos archivos de middlewars
const _ = require('underscore') //Para funciones de javascript

const app = express()

//Rutas
app.get('/api/sucursales', verificarToken, (req, res) => {
    //Obtenemos todos las sucursales con find
    let desde = req.query.desde || 0
    desde = Number(desde)

    let limite = req.query.limite
    limite = Number(limite)

    //Sucursales.find({ google: true }) --> podemos enviarle condiciones para la consulta
    //El segundo parametro es para decirle que campos queremos que nos regrese
    //estador : true -> para decirle que solo los que tienen estado true
    Sucursales.find({}, '')
        .skip(desde) //Para poner de donde quiere empezar
        .limit(limite) //Cantidad de registros que quiere ver
        .sort({ nombre: 1 }) //Para odenar los datos [1 Ascendente -1 Descendente]
        //y le pasamos los campos que queremos que nos traega
        .populate('usuario', 'nombre email role')
        .exec((err, sucursales) => {
            if (err) {
                return res.status(200).json({
                    ok: false,
                    err
                })
            }
            //De esta manera es mejor hacer la consulta del coun para saber cuantos hay
            //estado : true -poner en el primer {}
            Sucursales.collection.countDocuments({}, {}, (err, cantidad) => {
                res.json({
                    ok: true,
                    sucursales,
                    cantidad
                })
            })

        })
})


//Ruta para obtener la sucursal de un cliente en especifico
app.get('/api/sucursales/:id', verificarToken, (req, res) => {
    //Obtenemos todos las sucursales con find
    let desde = req.query.desde || 0
    desde = Number(desde)

    let limite = req.query.limite
    limite = Number(limite)

    let id = req.params.id

    //Sucursales.find({ google: true }) --> podemos enviarle condiciones para la consulta
    //El segundo parametro es para decirle que campos queremos que nos regrese
    //estador : true -> para decirle que solo los que tienen estado true
    Sucursales.find({ usuario: id }, '')
        .skip(desde) //Para poner de donde quiere empezar
        .limit(limite) //Cantidad de registros que quiere ver
        .sort({ nombre: 1 }) //Para odenar los datos [1 Ascendente -1 Descendente]
        //y le pasamos los campos que queremos que nos traega
        .populate('usuario', 'nombre email role')
        .exec((err, sucursales) => {
            if (err) {
                return res.status(200).json({
                    ok: false,
                    err
                })
            }
            //De esta manera es mejor hacer la consulta del coun para saber cuantos hay
            //estado : true -poner en el primer {}
            Sucursales.collection.countDocuments({}, {}, (err, cantidad) => {
                res.json({
                    ok: true,
                    sucursales,
                    cantidad
                })
            })

        })
})

app.post('/api/sucursales', verificarToken, (req, res) => {

    //Obtenemos los datos
    let body = req.body

    //Creamos un objeto para crear un Sucursales
    let sucursales = new Sucursales({
        usuario: req.usuario._id,
        nombre: body.nombre,
        direccion: body.direccion,
        tel: body.tel
    })

    //Guardamos en la base de datos
    sucursales.save((err, sucursalesDB) => {
        if (err) {
            return res.status(200).json({
                ok: false,
                err
            })
        }

        //Si no hay errores mostramos el sucursale creado
        res.json({
            ok: true,
            sucursales: sucursalesDB
        })
    })
})

app.put('/api/sucursales/:id', (req, res) => {
    let id = req.params.id

    //Otra manera usando underscore
    //let body = _.pick(req.body, ['nombre', 'direccion', 'tel'])

    Sucursales.findByIdAndUpdate(id, req.body, { new: true, runValidators: true }, (err, sucursalesDB) => {
        if (err) {
            return res.status(200).json({
                ok: false,
                err
            })
        }
        res.json({
            ok: true,
            sucursales: sucursalesDB
        })
    })
})

app.delete('/api/sucursales/:id', (req, res) => {
    let id = req.params.id

    //Eliminamos con 
    Sucursales.findByIdAndRemove(id, (err, sucursalBorrado) => { //--> esta es para eliminar todo el registro
        //Sucursales.findByIdAndUpdate(id, { estado: false }, { new: true }, (err, sucursalBorrado) => { //con esta solo se actualiza
        if (err) {
            return res.status(200).json({
                ok: false,
                err
            })
        }

        //Checamos si existe la sucursal
        if (!sucursalBorrado) {
            return res.status(200).json({
                ok: false,
                err: {
                    message: 'Sucursal no encontrada'
                }
            })
        }

        res.json({
            ok: true,
            sucursalBorrado
        })
    })
})


module.exports = app