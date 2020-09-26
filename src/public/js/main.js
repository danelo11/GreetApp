$(function(){
    const socket = io();
    
    //obteniendo datos del navegador
    const canal = $('#channel');
    const formulario = $('#formesages');
    const message = $('#mensaje');

    const nickform = $('#nicknameform');
    const error = $('#error');
    const nickname = $('#nickname');

    const usuarios = $('#usuarios');

    nickform.submit(function(event){
        event.preventDefault();
        socket.emit('nuevo usuario', nickname.val(), function(user){
            if(user){
                $('#identificativo').hide();
                $('#chicha').show();
            }else{
                error.html(`
                <div class="alert alert-danger">
                    Ese usuario ya existe.
                </div>
                `)
            }
        });
        nickname.val('');
    })
    
    formulario.submit(function(event){
        event.preventDefault();
        socket.emit('enviar mensaje', message.val(), function(datos){
            canal.append(`<p class="fallo">${datos}</p>`)
        });
        message.val('');
    })

    socket.on('nuevo mensaje', function(object){
        canal.append('<b>' + object.usuario + '</b>: ' + object.mensaje + '</br>');
    })

    socket.on('usuarios', function(datos){
        let interfaz = '';
        for(var i=0;i<datos.length;i++){
            interfaz += `<p><i class="far fa-user"></i> ${datos[i]}</p>`
        }
        usuarios.html(interfaz);
    })

    socket.on('privado', function(datos){
        canal.append(`<p class="privado"><b>${datos.nick}</b>: ${datos.message}</p>`);  
    })

    socket.on('cargar antiguos', function(hiddenmsg){
        for (var i = 0;i<hiddenmsg.length;i++){
            mostrarmensaje(hiddenmsg[i]);
        }
    })

    function mostrarmensaje(mes){
        canal.append(`<p class="privado"><b> ${mes.nick} </b>: ${mes.content}</p>`);
    }
})