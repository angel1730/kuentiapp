const express = require('express')
const bcrypt = require('bcrypt') //Paquete para encriptar contraseñas
const jwt = require('jsonwebtoken') //Imporamos el jwt para generar los tokens
const Usuario = require('../models/usuario') //Importamos el modelo usuario
const { verificarToken, verificarAdminRole, verificarTokenLocation } = require('../middlewars/autenticacion') //Importamos archivos de middlewars
const _ = require('underscore') //Para funciones de javascript

const app = express()

//Ruta para redireccionar con location.href (Middleware)
app.get('/verificaLocation/:token', verificarTokenLocation)

//Creamos la ruta para hacer el login
app.post('/login', (req, res) => {
    let body = req.body // Recibimos los datos

    Usuario.findOne({ email: body.email, estado: true }, (err, usuarioDB) => {
        if (err) {
            return res.status(200).json({
                ok: false,
                err: {
                    mensaje: 'Error en la base de datos'
                }
            })
        }

        //Checamos si existe el usuario
        if (!usuarioDB) {
            return res.status(200).json({
                ok: false,
                err: {
                    message: '(Usuario) o contraseña incorrectos'
                }
            })
        }

        //Checamos si la contraseña es correcta (Regresa true si es vdd)
        if (!bcrypt.compareSync(body.password, usuarioDB.password)) {
            return res.status(200).json({
                ok: false,
                err: {
                    message: 'Usuario o (contraseña) incorrectos'
                }
            })
        }

        //Quitamos el token de usuarioDB
        //El _id esta demas por seguridad quitarlo
        let usuarioDBaux = _.pick(usuarioDB, ['_id', 'nombre', 'email', 'role', 'estado']) //Usarlo para generar token

        //Creamos el token
        let token = jwt.sign({
            usuario: usuarioDBaux
        }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN })

        //Actualizamos el token
        Usuario.findByIdAndUpdate(usuarioDB._id, { token: token }, { new: true, runValidators: true }, (err, usuarioUpdate) => {
            if (err) {
                res.json({
                    ok: false,
                    err: {
                        message: 'Error al actualizar token'
                    }
                })
            }

            //regresamos la respuesta
            res.json({
                ok: true,
                usuario: usuarioUpdate,
                token
            })
        })
    })
})

module.exports = app