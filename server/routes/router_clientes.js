const express = require('express')
const bcrypt = require('bcrypt') //Paquete para encriptar contraseñas
const Clientes = require('../models/clientes') //Importamos el modelo Clientes

const { verificarToken, verificarAdminRole } = require('../middlewars/autenticacion') //Importamos archivos de middlewars
const _ = require('underscore') //Para funciones de javascript

const app = express()

//Rutas
app.get('/api/clientes', verificarToken, (req, res) => {
    //Obtenemos todos las Clientes con find
    let desde = req.query.desde || 0
    desde = Number(desde)

    let limite = req.query.limite
    limite = Number(limite)

    Clientes.find({}, '')
        .skip(desde) //Para poner de donde quiere empezar
        .limit(limite) //Cantidad de registros que quiere ver
        .sort({ nombre: 1 }) //Para odenar los datos [1 Ascendente -1 Descendente]
        //y le pasamos los campos que queremos que nos traega
        .populate('sucursal', 'nombre direccion tel')
        .exec((err, clientes) => {
            if (err) {
                return res.status(200).json({
                    ok: false,
                    err
                })
            }

            //De esta manera es mejor hacer la consulta del coun para saber cuantos hay
            //estado : true -poner en el primer {}
            Clientes.collection.countDocuments({}, {}, (err, cantidad) => {
                res.json({
                    ok: true,
                    clientes,
                    cantidad
                })
            })

        })
})


//Para obtener los Clientes de una sucursal especifica
app.get('/api/clientes/:id', verificarToken, (req, res) => {
    //Obtenemos todos las Clientes con find
    let desde = req.query.desde || 0
    desde = Number(desde)

    let limite = req.query.limite
    limite = Number(limite)

    let id = req.params.id

    Clientes.find({ sucursal: id }, '')
        .skip(desde) //Para poner de donde quiere empezar
        .limit(limite) //Cantidad de registros que quiere ver
        .sort({ nombre: 1 }) //Para odenar los datos [1 Ascendente -1 Descendente]
        //y le pasamos los campos que queremos que nos traega
        .populate('sucursal', 'nombre direccion tel')
        .exec((err, clientes) => {
            if (err) {
                return res.status(200).json({
                    ok: false,
                    err
                })
            }

            //De esta manera es mejor hacer la consulta del coun para saber cuantos hay
            //estado : true -poner en el primer {}
            Clientes.collection.countDocuments({}, {}, (err, cantidad) => {
                res.json({
                    ok: true,
                    clientes,
                    cantidad
                })
            })

        })
})

app.post('/api/clientes', verificarToken, (req, res) => {

    //Obtenemos los datos
    let body = req.body

    //Creamos un objeto para crear un Clientes
    let clientes = new Clientes({
        mesa: body.mesa,
        mesero: body.mesero,
        sucursal: body.sucursal
    })

    //Guardamos en la base de datos
    clientes.save((err, clientesDB) => {
        if (err) {
            return res.status(200).json({
                ok: false,
                err
            })
        }

        //Si no hay errores mostramos el Clientes creado
        res.json({
            ok: true,
            clientes: clientesDB
        })
    })
})

app.put('/api/clientes/:id', (req, res) => {
    let id = req.params.id

    //Otra manera usando underscore
    //let body = _.pick(req.body, ['nombre', 'precio', 'cantidad'])

    Clientes.findByIdAndUpdate(id, req.body, { new: true, runValidators: true }, (err, clientesDB) => {
        if (err) {
            return res.status(200).json({
                ok: false,
                err
            })
        }
        res.json({
            ok: true,
            clientes: clientesDB
        })
    })
})

app.delete('/api/clientes/:id', (req, res) => {
    let id = req.params.id

    //Eliminamos con 
    Clientes.findByIdAndRemove(id, (err, clienteBorrado) => { //--> esta es para eliminar todo el registro
        //Clientes.findByIdAndUpdate(id, { estado: false }, { new: true }, (err, clienteBorrado) => { //con esta solo se actualiza
        if (err) {
            return res.status(200).json({
                ok: false,
                err
            })
        }

        //Checamos si existe la Clientes
        if (!clienteBorrado) {
            return res.status(200).json({
                ok: false,
                err: {
                    message: 'Clientes no encontrada'
                }
            })
        }

        res.json({
            ok: true,
            clienteBorrado
        })
    })
})


module.exports = app