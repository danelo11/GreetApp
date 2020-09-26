const MensajesSchema = require('./modelos/mensajes');

module.exports = function(io){

    var usuarios = {};

    io.on('connection', async function(socket){
        var hiddenmsg = await MensajesSchema.find({}); 
        socket.emit('cargar antiguos', hiddenmsg);
        socket.on('nuevo usuario', function(user, callback){
            if(user in usuarios){
                callback(false);
            }else{
                callback(true);
                socket.nickname = user;
                usuarios[socket.nickname] = socket;
                modificarUsuarios();
            }
        })
        socket.on('enviar mensaje', async function(mes,callback){
            var message = mes.trim();
            if(message.substr(0,3) === '/w '){
                message = message.substr(3);
                const indice = message.indexOf(' ');
                if(indice != -1){
                    var nombre = message.substr(0, indice);
                    message = message.substr(indice +1);
                    if(nombre in usuarios){
                        var privado = new MensajesSchema({
                            nick: socket.nickname, 
                            type: "private",
                            content: message
                        });
                        await privado.save();
                        usuarios[nombre].emit('privado', {
                            message,
                            nick: socket.nickname
                        })
                    }else{
                        callback('Selecciona un usuario conectado');
                    }
                }else{
                    callback("Es necesario incluir un espacio entre el destinatario y el mensaje");
                }
            }else{
                var guardar = new MensajesSchema({
                    nick: socket.nickname, 
                    type: "common",
                    content: message
                });
                await guardar.save();

                io.sockets.emit('nuevo mensaje', {
                    usuario: socket.nickname,
                    mensaje: mes,
                });
            }
        })

        socket.on('disconnect', function(user){
            if(!socket.nickname){
                return;
            }else{
                delete usuarios[socket.nickname];
                modificarUsuarios();
            }
        })

        function modificarUsuarios(){
            io.sockets.emit('usuarios', Object.keys(usuarios));
        }
    });
}