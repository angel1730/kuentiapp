//Creamos un archivo donde tengamos todas las rutas
const express = require('express')
const app = express()

//Agregamos todas las rutas
//Importamos y usamos las rutas de las sesiones
app.use(require('./sesion'))

//Importamos las rutas de los usuarios
app.use(require('./router_usuarios'))

//Importamos las rutas de las sucursales
app.use(require('./router_sucursales'))

//Importamos las rutas de los productos
app.use(require('./router_productos'))

//Importamos las rutas de los clientes
app.use(require('./router_clientes'))

//Importamos las rutas de las ordenes
app.use(require('./router_orden'))

module.exports = app