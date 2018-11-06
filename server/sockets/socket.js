//Estamos trabajando del lado del backend
const { io } = require('../server')

io.on('connection', (client) => {
    console.log('Cliente conectado.');

    //Para cuando se desconecte un client
    client.on('disconnect', () => {
        console.log('Cliente desconectado.');
    })

    //los on reciben el comando y una funcion de retorno
    //los emit('emitir' ,{datos}, () => {} )
    //los client.broadcast.emit('emitir' ,{datos}, () => {} )
})