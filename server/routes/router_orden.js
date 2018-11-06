const express = require('express')
const Ordenes = require('../models/orden') //Importamos el modelo Ordenes

const { verificarToken, verificarAdminRole } = require('../middlewars/autenticacion') //Importamos archivos de middlewars
const _ = require('underscore') //Para funciones de javascript

const app = express()

//Rutas
app.get('/api/orden', verificarToken, (req, res) => {
    //Obtenemos todos las Ordenes con find
    let desde = req.query.desde || 0
    desde = Number(desde)

    let limite = req.query.limite
    limite = Number(limite)

    Ordenes.find({}, '')
        .skip(desde) //Para poner de donde quiere empezar
        .limit(limite) //Cantidad de registros que quiere ver
        .sort({ nombre: 1 }) //Para odenar los datos [1 Ascendente -1 Descendente]
        //y le pasamos los campos que queremos que nos traega
        .populate('producto', 'nombre cantidad precio')
        .populate('cliente', 'fecha mesero mesa')
        .exec((err, ordenes) => {
            if (err) {
                return res.status(200).json({
                    ok: false,
                    err
                })
            }

            //De esta manera es mejor hacer la consulta del coun para saber cuantos hay
            //estado : true -poner en el primer {}
            Ordenes.collection.countDocuments({}, {}, (err, cantidad) => {
                res.json({
                    ok: true,
                    ordenes,
                    cantidad
                })
            })

        })
})


//Para obtener los Ordenes de una sucursal especifica
app.get('/api/orden/:id', verificarToken, (req, res) => {
    //Obtenemos todos las Ordenes con find
    let desde = req.query.desde || 0
    desde = Number(desde)

    let limite = req.query.limite
    limite = Number(limite)

    let id = req.params.id

    Ordenes.find({ cliente: id }, '')
        .skip(desde) //Para poner de donde quiere empezar
        .limit(limite) //Cantidad de registros que quiere ver
        .sort({ nombre: 1 }) //Para odenar los datos [1 Ascendente -1 Descendente]
        //y le pasamos los campos que queremos que nos traega
        .populate('producto', 'nombre cantidad precio')
        .populate('cliente', 'fecha mesero mesa')
        .exec((err, ordenes) => {
            if (err) {
                return res.status(200).json({
                    ok: false,
                    err
                })
            }

            //De esta manera es mejor hacer la consulta del coun para saber cuantos hay
            //estado : true -poner en el primer {}
            Ordenes.collection.countDocuments({}, {}, (err, cantidad) => {
                res.json({
                    ok: true,
                    ordenes,
                    cantidad
                })
            })

        })
})

app.post('/api/orden', verificarToken, (req, res) => {

    //Obtenemos los datos
    let body = req.body

    //Creamos un objeto para crear un Ordenes
    let ordenes = new Ordenes({
        producto: body.producto,
        cliente: body.cliente
    })

    //Guardamos en la base de datos
    ordenes.save((err, ordenesDB) => {
        if (err) {
            return res.status(200).json({
                ok: false,
                err
            })
        }

        //Si no hay errores mostramos el Ordenes creado
        res.json({
            ok: true,
            ordenes: ordenesDB
        })
    })
})

// app.put('/api/orden/:id', (req, res) => {
//     let id = req.params.id

//     //Otra manera usando underscore
//     //let body = _.pick(req.body, ['nombre', 'precio', 'cantidad'])

//     Ordenes.findByIdAndUpdate(id, req.body, { new: true, runValidators: true }, (err, ordenesDB) => {
//         if (err) {
//             return res.status(200).json({
//                 ok: false,
//                 err
//             })
//         }
//         res.json({
//             ok: true,
//             ordenes: ordenesDB
//         })
//     })
// })

app.delete('/api/orden/:id', (req, res) => {
    let id = req.params.id

    //Eliminamos con 
    Ordenes.findByIdAndRemove(id, (err, clienteBorrado) => { //--> esta es para eliminar todo el registro
        //Ordenes.findByIdAndUpdate(id, { estado: false }, { new: true }, (err, clienteBorrado) => { //con esta solo se actualiza
        if (err) {
            return res.status(200).json({
                ok: false,
                err
            })
        }

        //Checamos si existe la Ordenes
        if (!clienteBorrado) {
            return res.status(200).json({
                ok: false,
                err: {
                    message: 'Ordenes no encontrada'
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