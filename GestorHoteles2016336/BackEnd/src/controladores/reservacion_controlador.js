"use strict";

const Reservacion = require("../modelos/reservacion_modelo");
const Hotel = require("../modelos/hotel_modelo");
const Habitacion = require("../modelos/habitacion_modelo");
const Usuario = require("../modelos/usuario_modelo");
const moment = require("moment");


function agregarReservacion(req, res) {

    if (req.user.rol === "ROL_CLIENTE"){
        var hotelId = req.params.idH;
    var habId = req.params.idR;
    var userId = req.params.idU;
    var params = req.body;

    console.log(params);
 
    if (params.fechaInicio && params.fechaFin) {
        var inicio = moment(params.fechaInicio, "YYYY-MM-DD");
        var fin = moment(params.fechaFin, "YYYY-MM-DD");
        if (inicio > fin) {
            return res.send({message: "La fecha de estadía sucede después que la fecha de retiro"});
        } else {
            var totalDays = fin.diff(inicio, "days");
            Usuario.findById(userId, (err, usuarioEncontrado) => {
                if (err) {
                    return res.status(500).send({ message: "Error al buscar usuario" });
                } else if (usuarioEncontrado) {
                    if (req.user.sub == userId) {
                        Hotel.findById(hotelId, (err, hotelEncontrado) => {
                            if (err) {
                                return res.status(500).send({ message: "Error al buscar hotel" });
                            } else if (hotelEncontrado) {
                                var count = hotelEncontrado.count_reservations + 1;
                                var hospedado = hotelEncontrado._id;
                                Habitacion.findById(habId, (err, habitacionEncontrada) => {
                                    if (err) {
                                        return res.status(500).send({ message: "Error al buscar habitación" });
                                    } else if (habitacionEncontrada) {
                                        var disponible = habitacionEncontrada.disponible;
                                        if (habitacionEncontrada.disponible == undefined) {
                                            var confirmacion = false;
                                            hotelEncontrado.habitaciones.forEach((element) => {
                                                if (String(element) == String(habitacionEncontrada._id)) {
                                                    confirmacion = true;
                                                }
                                            });
                                            if (confirmacion == true) {
                                                if (habitacionEncontrada.available == true) {
                                                    var precio = totalDays * habitacionEncontrada.precio;
                                                    var reservacion = new Reservacion();

                                                    reservacion.fechaInicio = params.fechaInicio;
                                                    reservacion.fechaFin = params.fechaFin;
                                                    reservacion.precio = precio;
                                                    reservacion.usuario = userId;
                                                    reservacion.hotel = hotelId;
                                                    reservacion.habitacion = habId;

                                                    params.servicios.forEach((servicio) => {
                                                        reservacion.servicios.push(servicio);
                                                    });

                                                    reservacion.save((err, reservacionGuardada) => {
                                                        if (err) {
                                                            return res.status(500).send({
                                                                message: "Error al guardar reservación",
                                                            });
                                                        } else if (reservacionGuardada) {
                                                            var hospedado = reservacionGuardada._id;
                                                            Hotel.findByIdAndUpdate(
                                                                hotelId, { reservaciones: count },(err, hotelActualizado) => {
                                                                    if (err) {
                                                                        return res.status(500).send({message: "Error al actualizar conteo" });
                                                                    } else if (hotelActualizado) {
                                                                        Habitacion.findByIdAndUpdate(
                                                                            habId, { disponible: false, disponible: fin },
                                                                            (err, habitacionActualizada) => {
                                                                                if (err) {
                                                                                    return res.status(500).send({message: "Error al deshabilitar habitación"});
                                                                                } else if (habitacionActualizada) {
                                                                                    Usuario.findByIdAndUpdate(userId, {$push: {reservaciones: hospedado, historial: hospedado},
                                                                                        },(err, usuarioActualizado) => {
                                                                                            if (err) {
                                                                                                return res.status(500).send({ message: "Error al actualizar registro de usuario"});
                                                                                            } else if (usuarioActualizado) {
                                                                                                return res.send({message: "Ha reservado la habitación exitosamente",reservacionGuardada});
                                                                                            } else {
                                                                                                return res.status(500).send({message: "No se actualizó el registro de usuario"});
                                                                                            }
                                                                                        }
                                                                                    );
                                                                                } else {
                                                                                    return res.status(500).send({message: "No se deshabilitó" });
                                                                                }
                                                                            }
                                                                        );
                                                                    } else {
                                                                        return res.status(500).send({ message: "No se actualizó el conteo"});
                                                                    }
                                                                }
                                                            );
                                                        } else {
                                                            return res.status(500).send({ message: "No se guardó" });
                                                        }
                                                    });
                                                } else {
                                                    return res.send({ message: "Habitación no disponible"});
                                                }
                                            } else {
                                                return res.send({ message: "La habitación no pertenece a este hotel" });
                                            }
                                        } else {
                                            return res.send({ message: "La habitación estará disponible hasta el día", disponible});
                                        }
                                    } else {
                                        return res.send({ message: "Habitación no encontrada" });
                                    }
                                });
                            } else {
                                return res.status(404).send({ message: "Hotel no encontrado" });
                            }
                        });
                    } else {
                        return res.status(401).send({ message: "No tienes permiso de reservar con este usuario"});
                    }
                } else {
                    return res.status(404).send({ message: "Usuario no encontrado" });
                }
            });
        }
    } else {
        return res.send({ message: "Ingrese los datos mínimos" });
    }
}
    }
    

function cancelarReservacion(req, res) {
    var reservacionId = req.params.idRes;

    Reservacion.findById(reservacionId, (err, reservacionEncontrada) => {
        if (err) {
            return res.status(500).send({ message: "Error al buscar reservación" });
        } else if (reservacionEncontrada) {
            var userId = reservacionEncontrada.usuario;
            var habId = reservacionEncontrada.habitacion;
            var hotelId = reservacionEncontrada.hotel;

            if (userId == req.user.sub || req.user.rol == "ROL_ADMIN" ||req.user.rol == "ROL_GERENTE") {
                Reservacion.findByIdAndRemove(reservacionId,(err, reservacionEliminada) => {
                        if (err) {
                            return res.status(500).send({ message: "Error al cancelar la reservación" });
                        } else if (reservacionEliminada) {
                            Usuario.findByIdAndUpdate( userId, {$pull: {reservaciones: reservacionId,historial: hotelId},
                                },(err, usuarioActualizado) => {
                                    if (err) {
                                        return res.status(500).send({message: "Error al eliminar registros en usuario"});
                                    } else if (usuarioActualizado) {
                                        Hotel.findById(hotelId, (err, hotelEncontrado) => {
                                            if (err) {
                                                return res.status(500).send({ message: "Error al buscar hotel" });
                                            } else if (hotelEncontrado) {
                                                var count = hotelEncontrado.reservaciones - 1;
                                                Hotel.findByIdAndUpdate(hotelId, { reservaciones: count },(err, hotelActualizado) => {
                                                        if (err) {
                                                            return res.status(500).send({ message: "Error al actualizar conteo de hotel" });
                                                        } else if (hotelActualizado) {
                                                            Habitacion.findByIdAndUpdate(habId, { disponible: true, dias: null },
                                                                (err, habitacionActualizada) => {
                                                                    if (err) {
                                                                        return res.status(500).send({message: "Error al actualizar disponibilidad de habitación" });
                                                                    } else if (habitacionActualizada) {
                                                                        return res.send({ message: "Reservación cancelada/eliminada exitosamente"});
                                                                    } else {
                                                                        return res.status(500).send({message: "No se actualizó la disponibilidad de la habitación"});
                                                                    }
                                                                }
                                                            );
                                                        } else {
                                                            return res.status(500).send({ message: "No se actualizó en conteo" });
                                                        }
                                                    }
                                                );
                                            } else {
                                                return res.status(404).send({ message: "No se encontró el hotel" });
                                            }
                                        });
                                    } else {
                                        return res.status(500).send({message: "No se eliminaron los registros en usuario"});
                                    }
                                }
                            );
                        } else {
                            return res.status(500).send({ message: "No se canceló" });
                        }
                    }
                );
            } else {
                return res.status(401).send({ messag: "No tienes permiso de cancelar esta reservación" });
            }
        } else {
            return res.status(404).send({ message: "Reservación no existente o ya fue eliminada" });
        }
    });
}

function obtenerReservacionesPorHotel(req, res) {
    let userId = req.user.sub;
    if (!userId) {
        return res.json({ message: "Error, envie el id del usuario" });
    } else {
        Hotel.findOne({ gerente: userId }, (err, hotelGuardado) => {
            if (err) {
                return res.status(500).send({message: "Error general" });
            } else if (hotelGuardado) {
                Reservacion.find({ hotel: hotelGuardado._id },
                    (err, reservationsFound) => {
                        if (err) {
                            return res.status(500).send({ message: "Error general" });
                        } else if (reservationsFound) {
                            return res.json({ message: "Reservaciones encontradas",reservationsFound});
                        } else {
                            return res.json({ message: "No hay reservaciones" });
                        }
                    }
                );
            } else {
                return res.json({  message: "No existe el hotel" });
            }
        });
    }
}

function obtenerReservacionUsuario(req,res){
    let userId = req.user.sub;
    Usuario.findById(userId).populate("reservaciones").exec((err,usuarioEncontrado)=>{
        if(err){
            return res.status(500).send({message: "Error al obtener reservaciones"});
        }else if(usuarioEncontrado){
            return res.send({message: "Reservaciones:", usuarioEncontrado});
        }else{
            return res.send({message: "No hay reservaciones"});
        }
    })
}

module.exports = {
  agregarReservacion,
  cancelarReservacion,
  obtenerReservacionesPorHotel,
  obtenerReservacionUsuario
};