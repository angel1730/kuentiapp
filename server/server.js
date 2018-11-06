require('./config/config') //Agregamos el archivo de variables globales

//importamos el express
const express = require('express')
const socketIO = require('socket.io') // Importamos el socketIO
const http = require('http') //Libreria para los sockets
const path = require('path') //Para las carpetas publicas
const bodyParser = require('body-parser') //Para enviar datos

//Agregamos mongoose para las bases de datos
const mongoose = require('mongoose')

const app = express()

//Para hacer peticiones desde cualquier servidor...
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');
    next();
});

let server = http.createServer(app)

// create application/json parser
app.use(bodyParser.json())

// create application/x-www-form-urlencoded parser
app.use(bodyParser.urlencoded({ extended: false }))

// view engine setup usamos jade como sistema de plantillas
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

//Path para las carpetas publicas
const publicPath = path.resolve(__dirname, '../public')

//Middlewares
app.use(express.static(publicPath))

//IO = esta es la comunicacion con el Backend
module.exports.io = socketIO(server)
require('./sockets/socket')

//Importamos y usamos todas las rutas
app.use(require('./routes/rutas'))

//Conectamos la base de datos...
mongoose.connect(process.env.URLDB, { useNewUrlParser: true })
    .then(() => console.log('Base de datos ONLINE'))
    .catch(err => console.log('No se puede conectar.'))

server.listen(process.env.PORT, (err) => {
    if (err) {
        console.log(`Error en la conexión: `, err);
    }

    console.log(`Servidor corriendo en el puerto ${ process.env.PORT }`)
})