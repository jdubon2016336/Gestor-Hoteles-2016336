"use strict";

const Evento = require("../modelos/evento_modelo");
const Hotel = require("../modelos/hotel_modelo");
const Usuario = require("../modelos/usuario_modelo");
const bcrypt = require("bcrypt-nodejs");



function agregarEvento(req, res) {
    var evento = new Evento();
    var params = req.body;
    var id = req.user.sub;

    if (!params.nombre || !params.tipo) {
        return res.status(400).send({message: "Ingrese todos los datos" });
    } else {
        Hotel.findOne({gerente: id}).populate("eventos").exec((err,hotelEncontrado)=>{
            if(err){
                return res.status(500).send({message: "Error al buscar hotel"});
            }else if(hotelEncontrado){
                var hotelId = hotelEncontrado._id;
                var activo = false;

                hotelEncontrado.eventos.forEach(evento => {
                    if(evento.nombre == params.nombre){
                        console.log(evento.nombre,params.nombre);
                        activo = true;
                    }
                });
                if(activo == false){
                    evento.nombre = params.nombre;
                    evento.tipo = params.tipo;
    
                    evento.save((err, eventoGuardado) => {
                        if (err) {
                            return res.status(500).send({ message: "Error general" });
                        } else if (eventoGuardado) { 
                            Hotel.findByIdAndUpdate(hotelId,{$push:{eventos: eventoGuardado}},{new: true},(err, hotelActualizado)=>{
                                if(err){
                                    return res.status(500).send({message: "Error al intentar agregar evento"});

                                }else if(hotelActualizado){
                                    return res.send({ message: "Evento creado y agregado con éxito",hotelActualizado, eventoGuardado  });

                                }else{
                                    return res.status(500).send({message: "No se agregó el evento al hotel"});
                                }
                            })  
                        } else {
                            return res.status(404).send({ message: "No se guardo correctamente el evento"  });
                        }
                    })
                }else{
                    return res.send({ok: false, message: "El evento ya existe en el hotel"});
                }
            }else{
                return res.status(404).send({message: "El hotel no existe"});
            }
        })
    }
}


function editarEvento(req, res) {
    let eventoId = req.params.id;
    let params = req.body;

    if (!eventoId) {
        return res.status(403).send({ message: "Ingrese los parametros" });
    } else {
        Evento.findByIdAndUpdate(eventoId,params, { new: true },(err, eventoActualizado) => {
                if (err) {
                    return res.status(500).send({ message: "Error General" });
                } else if (eventoActualizado) {
                    return res.send({ message: "Evento actualizado", eventoActualizado});
                } else {
                    return res.status(404).send({message: "Error, no se logro actualizar el evento" });
                }
            }
        );
    }
}



function eliminarEvento(req, res) {
    let eventoId = req.params.id;
    let id = req.user.sub;

    Evento.findById(eventoId, (err, eventoEncontrado) => {
        if (err) {
            return res.status(500).send({ ok: false, message: "Error General" });
        } else if (eventoEncontrado) {
            Hotel.findOne({gerente: id}).populate("eventos").exec((err,hotelEncontrado)=>{
                if(err){
                    return res.status(500).send({message: "Error al buscar hotel"});
                }else if(hotelEncontrado){
                    var hotelId = hotelEncontrado._id;
                    var activo = false;
                    hotelEncontrado.eventos.forEach(evento =>{
                        if(evento.nombre == eventoEncontrado.nombre){
                            activo = true;
                        }
                    })
                    if(activo == true){
                        Hotel.findByIdAndUpdate(hotelId,{$pull:{eventos: eventoId}},{new:true},(err,hotelActualizado)=>{
                            if(err){
                                return res.status(500).send({message: "Error al intentar eliminar evento del hotel"});
                            }else if(hotelActualizado){
                                Evento.findByIdAndDelete(eventId, (err, eventoEliminado) => {
                                    if (err) {
                                        return res.status(500).send({ message: "Error General" });

                                    } else if (eventoEliminado) {
                                        return res.send({  message: "Evento eliminado correctamente" });

                                    } else {
                                        return res.status(400).send({ message: "No se logro eliminar el evento" });
                                    }
                                });
                            }else{
                                return res.status(500).send({message: "Error al eliminar evento del hotel"});
                            }
                        })
                    }else{
                        return res.send({message: "El evento no pertenece al hotel"});
                    }
                }else{
                    return res.status(404).send({message: "No es administrador de ningún hotel"});
                }
            })
        } else {
            return res.status(404).send({ message: "No existe el evento" });
        }
    });

}

function obtenerEventos(req, res) {
    var id = req.user.sub;

    Hotel.findOne({gerente: id}).populate("eventos").exec((err, hotelEncontrado)=>{
        if(err){
            return res.status(500).send({message: "Error al buscar hotel"});
        }else if(hotelEncontrado){
            var eventos = [];
            hotelEncontrado.eventos.forEach(evento =>{
                eventos.push(evento);
            })
            return res.send({message: "Eventos: ",eventos});
        }else{
            return res.status(404).send({message: "No es gerente de ningún hotel"});
        }
    })
}

function obtenerEvento(req, res) {
    let id = req.params.id;

    Evento.findById(id).exec((err, evento) => {
        if (err) {
            return res.status(500).send({ message: "Error general" });
        } else if (evento) {
            return res.send({message: "Evento encontrado", evento });
        } else {
            return res.status(404).send({ message: "no evento" });
        }
    });

}



module.exports = {
    agregarEvento,
    editarEvento,
    eliminarEvento,
    obtenerEvento,
    obtenerEventos
};