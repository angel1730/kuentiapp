// ===============================
//           Puerto
// ===============================

process.env.PORT = process.env.PORT || 3000

// ===============================
//           Entorno
// ===============================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev'

// ===============================
//     Vencimiento del token
// ===============================
//60 segundos
//60 minutos
//24 Horas
//30 dias
//process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30
process.env.CADUCIDAD_TOKEN = '12h'

// ===============================
//       SEED de autenticación
// ===============================
process.env.SEED = process.env.SEED || 'este-es-el-seed-de-desarrollo'

// ===============================
//           Base de datos
// ===============================
let urlDB

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/kuenti'
} else {
    //Variable de entorno de heroku creada desde la terminal MONGO_URI
    urlDB = process.env.MONGO_URI
}

process.env.URLDB = urlDB