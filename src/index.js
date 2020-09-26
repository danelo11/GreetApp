require('dotenv').config();
//Declaraciones
const express = require('express');
const path = require('path');

//Inicializaciones
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

require('./sockets')(io);
require('./database');

//Configuracion
app.set('port', process.env.PORT || 5000);
app.set('views', path.join(__dirname, 'views'));

//Archivos estaticos
app.use(express.static(path.join(__dirname, 'public')));

server.listen(app.get('port'), () => {
    if(process.env.PORT){
        console.log('Environment:', process.env.NODE_ENV);
    }else{
        console.log('Server listening on port', app.get('port'));
    }
});