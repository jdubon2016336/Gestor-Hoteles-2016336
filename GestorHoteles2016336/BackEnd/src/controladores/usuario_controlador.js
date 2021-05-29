"use strict";

const Usuario = require("../modelos/usuario_modelo");
const bcrypt = require("bcrypt-nodejs");
const jwt = require("../servicios/jwt");

function login(req, res) {
    var params = req.body; 
    Usuario.findOne({username: params.username}, (err, usuarioEncontrado)=>{
        if(err) return res.status(500).send({mensaje: "Error en la petición"});
        if(usuarioEncontrado){
            bcrypt.compare(params.password, usuarioEncontrado.password, (err, passVerificada)=>{
                if(err) return res.status(500).send({mensaje: "Error en la petición 2"});
                if(passVerificada){
                     if(params.getToken == "true"){
                        return res.status(200).send({token: jwt.createToken(usuarioEncontrado)});
                     }else{
                        usuarioEncontrado.password = undefined;
                        return res.status(200).send({usuarioEncontrado});
                     }
                }else{
                    return res.status(500).send({mensaje:"El Usuario no se a podido identificar"});
                }
            })


        }else{
            return res.status(500).send({mensaje:"Error al buscar el Usuario"})
        }
    })
}

function registrar(req,res){
    var usuario = new Usuario();
    var params = req.body;
    
    if(params.username && params.password){
        usuario.nombre = params.nombre;
        usuario.username = params.username
        usuario.password = params.password;
        usuario.rol = params.rol;

        Usuario.find({nombre:usuario.nombre}).exec((err, usuarioEncontrado)=>{
            if(err) return res.status(500).send({mensaje: 'Error en la solicitud de usuarios'});

            if(usuarioEncontrado && usuarioEncontrado.length >=1){
                return res.status(200).send({mensaje:'Este usuario ya existe'});
            }else{
                bcrypt.hash(params.password, null, null, (err, contraEncriptada)=>{
                    usuario.password = contraEncriptada;

                    usuario.save((err, usuarioGuardado)=>{
                        if(err) return res.status(500).send({mensaje: 'Error al guardar'});

                        if (usuarioGuardado){
                           return res.status(200).send(usuarioGuardado);
                        }else{
                           return res.status(404).send({ mensaje: 'No se ha podido registrar el Usuario'});
                        }
                    })
                })
            }
        })
    }
    
    
}

function editarUsuario(req, res) {

 
    var idUsuario = req.params.id;
    var params = req.body;

    delete params.password;

    if (idUsuario != params.id) {
        return res.status(500).send({ mensaje: 'No posee los permisos para editar ese usuario' });
    }
    
    Usuario.findByIdAndUpdate(idUsuario, params, { new: true }, (err, usuarioActualizado) => {
        if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
        if (!usuarioActualizado) return res.status(500).send({ mensaje: 'No se a podido editar al Usuario' });

        return res.status(200).send({ usuarioActualizado })
    })

  
}

function eliminarUsuario(req, res){
    
        var idUsuario = req.params.id;
        var params = req.boby;
    
    
        if (idUsuario != params.id) {
            return res.status(500).send({ mensaje: 'No posee los permisos para eliminar ese usuario' });
        }
        
        Usuario.findByIdAndDelete(idUsuario, (err, usuarioEliminado) => {
            if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
            if (!usuarioEliminado) return res.status(500).send({ mensaje: 'No se a podido eliminar al Usuario' });
    
            return res.status(200).send({ mensaje:"usuario eliminado" })
        })
    }
    


function obtenerUsuario(req, res) {
    let userId = req.params.id;

    Usuario.findById({ _id: userId }).exec((err, usuario) => {
        if (err) {
            return res.status(500).send({ message: "Error al buscar usuario" });
        } else if (usuario) {
            return res.send({ message: "Usuario encontrado", usuario });
        } else {
            return res.send({ message: "Usuario inexistente" });
        }
    });
}

function obtenerUsuarios(req, res) {
    Usuario.find({}).exec((err, usuarios) => {
        if (err) {
            return res.status(500).send({ message: "Error al obtener usuarios" });
        } else if (usuarios) {
            return res.send({ message: "Usuarios", usuarios });
        } else {
            return res.send({ message: "No hay usuarios" });
        }
    });
}

function obtenerGerentes(req, res) {
    Usuario.find({ rol: "ROL_GERENTE" }, (err, gerentes) => {
        if (err) {
            return res.status(500).send({ message: "Error general" });
        } else if (gerentes) {
            
            return res.json({message: "Usuarios Administradores de hoteles",gerentes });
        } else {
            return res.status(404).send({  message: "No se encontraron usuarios" });
        }
    });
}


module.exports = {
   registrar,
   login,
   editarUsuario,
   eliminarUsuario,
   obtenerUsuario,
   obtenerUsuarios,
   obtenerGerentes
};