const express = require('express')
const bcrypt = require('bcrypt') //Paquete para encriptar contraseñas
const Productos = require('../models/productos') //Importamos el modelo productos

const { verificarToken, verificarAdminRole } = require('../middlewars/autenticacion') //Importamos archivos de middlewars
const _ = require('underscore') //Para funciones de javascript

const app = express()

//Rutas
app.get('/api/productos', verificarToken, (req, res) => {
    //Obtenemos todos las Productos con find
    let desde = req.query.desde || 0
    desde = Number(desde)

    let limite = req.query.limite
    limite = Number(limite)

    Productos.find({}, '')
        .skip(desde) //Para poner de donde quiere empezar
        .limit(limite) //Cantidad de registros que quiere ver
        .sort({ nombre: 1 }) //Para odenar los datos [1 Ascendente -1 Descendente]
        //y le pasamos los campos que queremos que nos traega
        .populate('sucursal', 'nombre direccion tel')
        .exec((err, productos) => {
            if (err) {
                return res.status(200).json({
                    ok: false,
                    err
                })
            }

            //De esta manera es mejor hacer la consulta del coun para saber cuantos hay
            //estado : true -poner en el primer {}
            Productos.collection.countDocuments({}, {}, (err, cantidad) => {
                res.json({
                    ok: true,
                    productos,
                    cantidad
                })
            })

        })
})


//Para obtener los productos de una sucursal especifica
app.get('/api/productos/:id', verificarToken, (req, res) => {
    //Obtenemos todos las Productos con find
    let desde = req.query.desde || 0
    desde = Number(desde)

    let limite = req.query.limite
    limite = Number(limite)

    let id = req.params.id

    Productos.find({ sucursal: id }, '')
        .skip(desde) //Para poner de donde quiere empezar
        .limit(limite) //Cantidad de registros que quiere ver
        .sort({ nombre: 1 }) //Para odenar los datos [1 Ascendente -1 Descendente]
        //y le pasamos los campos que queremos que nos traega
        .populate('sucursal', 'nombre direccion tel')
        .exec((err, productos) => {
            if (err) {
                return res.status(200).json({
                    ok: false,
                    err
                })
            }

            //De esta manera es mejor hacer la consulta del coun para saber cuantos hay
            //estado : true -poner en el primer {}
            Productos.collection.countDocuments({}, {}, (err, cantidad) => {
                res.json({
                    ok: true,
                    productos,
                    cantidad
                })
            })

        })
})

app.post('/api/productos', verificarToken, (req, res) => {

    //Obtenemos los datos
    let body = req.body

    //Creamos un objeto para crear un Productos
    let productos = new Productos({
        sucursal: body.sucursal,
        nombre: body.nombre,
        precio: body.precio,
        cantidad: body.cantidad
    })

    //Guardamos en la base de datos
    productos.save((err, productosDB) => {
        if (err) {
            return res.status(200).json({
                ok: false,
                err
            })
        }

        //Si no hay errores mostramos el producto creado
        res.json({
            ok: true,
            productos: productosDB
        })
    })
})

app.put('/api/productos/:id', (req, res) => {
    let id = req.params.id

    //Otra manera usando underscore
    //let body = _.pick(req.body, ['nombre', 'precio', 'cantidad'])

    Productos.findByIdAndUpdate(id, req.body, { new: true, runValidators: true }, (err, productosDB) => {
        if (err) {
            return res.status(200).json({
                ok: false,
                err
            })
        }
        res.json({
            ok: true,
            productos: productosDB
        })
    })
})

app.delete('/api/productos/:id', (req, res) => {
    let id = req.params.id

    //Eliminamos con 
    Productos.findByIdAndRemove(id, (err, productoBorrado) => { //--> esta es para eliminar todo el registro
        //Productos.findByIdAndUpdate(id, { estado: false }, { new: true }, (err, productoBorrado) => { //con esta solo se actualiza
        if (err) {
            return res.status(200).json({
                ok: false,
                err
            })
        }

        //Checamos si existe la producto
        if (!productoBorrado) {
            return res.status(200).json({
                ok: false,
                err: {
                    message: 'Producto no encontrada'
                }
            })
        }

        res.json({
            ok: true,
            productoBorrado
        })
    })
})


module.exports = app