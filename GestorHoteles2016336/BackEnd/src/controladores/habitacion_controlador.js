"use strict";

const Habitacion = require("../modelos/habitacion_modelo");
const Hotel = require("../modelos/hotel_modelo");
const Usuario = require("../modelos/usuario_modelo");
const bcrypt = require("bcrypt-nodejs");

function agregarHabitacion(req, res) {
    if (req.user.rol === "ROL_ADMIN"){
        let habitacion = new Habitacion();
    let hotelId = req.params.idH;
    let params = req.body;

    if (!params.nombre && !params.precio && !params.tipo) {
        return res.status(400).send({ message: "Ingrese los datos necesarios" });
    } else {
        Hotel.findById(hotelId, (err, hotelEncontrado) => {
            if (err) {
                return res.status(500).send({message: "Error general" });
            } else if (hotelEncontrado) {
                let existe = false;
                hotelEncontrado.habitaciones.forEach((habitacion) => {
                    if (habitacion.nombre == params.nombre) {
                        existe = true;
                    }
                });

                if (!existe) {
                    habitacion.nombre = params.nombre;
                    habitacion.precio = params.precio;
                    habitacion.tipo = params.tipo;
                    habitacion.save((err, habitacionGuardada) => {
                        if (err) {
                            return res.status(500).send({ message: "Error general" });
                        } else if (habitacionGuardada) {
                            Hotel.findByIdAndUpdate( hotelId, { $push: { habitaciones: habitacionGuardada._id } }, { new: true },(err, hotelActualizado) => {
                                    if (err) {
                                        return res.status(500).send({ message: "Error general" });
                                    } else if (hotelActualizado) {
                                        return res.send({ message: "Habitacion creada correctamente",habitacionGuardada,
                                        });
                                    } else {
                                        return res.status(404).send({message: "No se guardo correctamente la habitacion del hotel"});
                                    }
                                }
                            );
                        } else {
                            return res.status(403).send({message: "No se logro crear la habitacion"});
                        }
                    });
                } else {
                    return res.json({  message: "La habitacion ya existe" });
                }
            } else {
                return res.json({ message: "no existe ese hotel" });
            }
        }).populate("habitaciones");
    }
}
    }
    

function obtenerHabitaciones(req, res) {
    Room.find({}).exec((err, habitaciones) => {
        if (err) {
            return res.status(500).send({ ok: false, message: "Error general" });
        } else if (habitaciones) {
            return res.send({ ok: true, message: "Habitaciones encontadas", habitaciones });
        } else {
            return res.status(404).send({ ok: false, message: "No habitaciones" });
        }
    });
}

function obtenerHabitacion(req, res) {
    let id = req.params.idR;

    if (id) {
        Habitacion.findById(id).exec((err, habitaciones) => {
            if (err) {
                return res.status(500).send({ message: "Error general" });
            } else if (habitaciones) {
                return res.send({message: "Habitaciones encontadas",habitaciones,
                });
            } else {
                return res.status(404).send({ message: "No habitaciones" });
            }
        });
        
    } 
}

function editarHabitacion(req, res) {
    if (req.user.rol === "ROL_ADMIN"){
    var id = req.params.id;
    var params = req.body;
    
    Hotel.findByIdAndUpdate(id, params, { new: true }, (err, habitacionActualizada) => {
        if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
        if (!habitacionActualizada) return res.status(500).send({ mensaje: 'No se a podido editar la habitacion' });

        return res.status(200).send({ habitacionActualizada })
    })
}
  
}

function eliminarHabitacion(req, res){
    if (req.user.rol === "ROL_ADMIN"){
        var id = req.params.idR;
        var params = req.body;
        var idHotel = req.params.idH;

    if (habitacion.disponible != true) {
        Hotel.findByIdAndUpdate( idHotel, { $pull: { habitaciones: id } }, (err, hotelActualizado) => {
                if (err) {
                    return res.status(500).send({ message: "Error al eliminar de hotel"});
                } else if (hotelActualizado) {
                    console.log(hotelActualizado.habitaciones);
                    Habitaciones.findByIdAndRemove( id, (err, habitacionEliminada) => {
                            if (err) {
                                return res.status(500).send({ message: "Error general"});
                            } else if (habitacionEliminada) {
                                return res.send({message: "Habitacion eliminada correctamente" });
                            } else {
                                return res.status(400).send({message: "No se logro eliminar la habitacion o ya fue eliminada" });
                            }
                        }
                    );
                } else {
                    return res.status(404).send({message: "No se eliminó del hotel" });
                }
            }
        );
    } else {
        return res.status(401).send({ message: "Esta habitación no pertenece a tu hotel"});
    }
    
    }
}


function obtenerEventosPorHabitacion(req, res) {
    var idd = req.user.sub;
    Hotel.findOne({ gerente: id }).populate("habitaciones").exec((err, hotelFinded) => {
            if (err) {
                return res.status(500).send({ message: "Error al buscar hotel" });
            } else if (hotelEncontrado) {
                var habitaciones = [];
                hotelEncontrado.habitaciones.forEach((habitacion) => {
                    if (habitacion.tipo != "Habitación Dormitorio") {
                        habitaciones.push(habitacion);
                    }
                });
                return res.send({ message: "Salones de eventos: ", habitaciones });
            } else {
                return res.status(404).send({ message: "No es administrador de ningún hotel" });
            }
        });
}

module.exports = {
    agregarHabitacion,
    obtenerHabitacion,
    obtenerHabitaciones,
    editarHabitacion,
    eliminarHabitacion,
    obtenerEventosPorHabitacion
};