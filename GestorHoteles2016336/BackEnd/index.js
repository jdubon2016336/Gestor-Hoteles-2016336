const mongoose = require("mongoose");
const app = require("./app");

    mongoose.Promise = global.Promise
    mongoose.connect('mongodb://localhost:27017/dbGestorHoteles', { useNewUrlParser: true, useUnifiedTopology: true }).then(()=>{
        console.log('Esta conectado a la base de datos');


        var nombre = 'Admin';
        var username = 'Admin';
        var password = '123456';
        var rol = 'ROL_ADMIN';
        var usuario = new Usuario();
    
        usuario.nombre = nombre;
        usuario.username = username
        usuario.password = password;
        usuario.rol = rol;
    
    
        Usuario.find({nombre: usuario.nombre}).exec((err, usuarioEncontrado)=>{
            if(usuarioEncontrado && usuarioEncontrado.length >=1){
                console.log('Este usuario ya existe'); 
            }else{
                bcrypt.hash(usuario.contraseña, null, null, (err, contraseñaEncriptada)=>{
                    usuario.contraseña = contraseñaEncriptada;
                    
                    usuario.save((err, usuarioGuardado)=>{
                        if(err)  console.log('Error en la solicitud de guardado');
                        
                        if (usuarioGuardado){
                              console.log({usuarioGuardado});
                        }else{
                              console.log('No se ha guardado el usuario');
                            }
                    })
                    }) 
            }
            
        })

        app.listen(3000, function () {
        console.log("Aplicacion corriendo en el puerto 3000");
    })
}).catch(err => console.log(err))

