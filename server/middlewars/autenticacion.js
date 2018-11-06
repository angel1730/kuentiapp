//Importamos el jwt
const jwt = require('jsonwebtoken')

//========================================
//   Verificar token
//========================================

let verificarToken = (req, res, next) => {

    //Obtenemos los headers de la sig manera
    let token = req.get('token')
        // let tokenpost = req.body.token
        // let tokenget = req.params.token
        // let token = ""

    // if (tokenpost) {
    //     //console.log("Token post : ", tokenpost)
    //     token = tokenpost
    // } else if (tokenget) {
    //     //console.log("Token get: ", tokenget)
    //     token = tokenget
    // }

    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            return res.status(200).json({
                ok: false,
                err: {
                    message: 'Token no válido',
                    err
                }
            })
        }
        req.usuario = decoded.usuario
        next()
    })
}

//========================================
//   Verificar Admin_role
//========================================

let verificarAdminRole = (req, res, next) => {
    let usuario = req.usuario

    if (usuario.role === 'USER_ROLE') {
        return res.status(200).json({
            ok: false,
            err: {
                message: 'El usuario no es administrador'
            }
        })
    }
    next()
}

//===================================================
//   Verificar token para los windows.location.href
//===================================================
let verificarTokenLocation = (req, res) => {

    //Obtenemos los headers de la sig manera
    //let token = req.get('token')
    let token = req.params.token

    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            return res.status(200).json({
                ok: false,
                err: {
                    message: 'Token no válido'
                }
            })
        }
        res.json({
            ok: true,
            role: decoded.usuario.role
        })
    })
}


module.exports = {
    verificarToken,
    verificarAdminRole,
    verificarTokenLocation
}