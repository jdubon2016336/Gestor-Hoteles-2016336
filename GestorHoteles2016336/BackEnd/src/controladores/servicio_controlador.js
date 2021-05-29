"use strict";

const Servicio = require("../modelos/servicio_modelo");
const Reservacion = require("../modelos/reservacion_modelo");
const Hotel = require("../modelos/hotel_modelo");
const User = require("../modelos/usuario_modelo");

function agregarServicio(req, res) {
    if(req.user.rol == "ROL_GERENTE"){
        let servicio = new Servicio();
    let params = req.body;
    let hotelId = req.params.idH;
    
    console.log(params);
    if (!params.nombre && !params.precio && !hotelId) {
        return res.send({ message: "Ingrese sus datos obligatorios" });
    } else {
        Hotel.findById(hotelId, (err, hotelEncontrado) => {
            
            console.log(hotelEncontrado);
            if (err) {
                return res.status(500).send({ message: "Error general" });
            } else if (hotelEncontrado) {
                let existe = false;
                hotelEncontrado.servicios.forEach((servicio) => {
                    if (servicio.nombre == params.nombre) {
                        existe = true;
                    } 
                });
                if (!existe) {
                    servicio.nombre = params.nombre;
                    servicio.precio = params.precio;
                    servicio.save((err, servicioGuardado) => {
                        if (err) {
                            return res.status(500).send({ message: "Error general" });
                        } else if (servicioGuardado) {
                            Hotel.findByIdAndUpdate(
                                hotelId, { $push: { servicios: servicioGuardado._id } }, { new: true },
                                (err, hotelActualizado) => {
                                    if (err) {
                                        return res.status(500).send({ message: "Error general" });
                                    } else if (hotelActualizado) {
                                        return res.send({message: "Servicio creado correctamente",servicioGuardado,hotelActualizado });
                                    } else {
                                        return res.status(404).send({ message: "No existe el hotel" });
                                    }
                                }
                            );
                        } else {
                            return res.status(404).send({message: "No se guardo correctamente el servicio"});
                        }
                    });
                } else {
                    return res.json({ message: "El servicio ya existe" });
                }
            } else {
                return res.json({ message: "no existe ese hotel" });
            }
        }).populate("servicios");
    }
}

    }
    
function obtenerServicios(req, res) {
    Servicio.find({}).exec((err, servicios) => {
        if (err) {
            return res.status(500).send({ message: "Error general" });
        } else if (servicios) {
            return res.send({ ok: true, message: "Servicios encontrados", servicios });
        } else {
            return res.status(404).send({ ok: false, message: "Sin servicios" });
        }
    });
}

function obtenerServicio(req, res) {
    let id = req.params.id;

    Servicio.findById(id).exec((err, servicio) => {
        if (err) {
            return res.status(500).send({ ok: false, message: "Error general" });
        } else if (servicio) {
            return res.send({  message: "Servicio encontrado", servicio });
        } else {
            return res.status(404).send({ message: "No servicio" });
        }
    });
    
}

function agregarServicioAReservacion(req, res) {
    var reservacionId = req.params.idR;
    var servicioId = req.params.idS;
    var userId = req.user.sub;

    Servicio.findById(servicioId, (err, servicioEncontrado) => {
        if (err) {
            return res.status(500).send({ message: "Error al buscar servicio" });
        } else if (servicioEncontrado) {
            var total = servicioEncontrado.precio;
            Reservacion.findById(reservacionId, (err, reservacionEncontrada) => {
                if (err) {
                    return res.status(500).send({ message: "Error al buscar reservación" });
                } else if (reservacionEncontrada) {
                    var confirmacion = false;
                    reservacionEncontrada.servicios.forEach((servicio) => {
                        if (servicio == servicioId) {
                            confirmacion = true;
                        }
                    });
                    var hotelId = reservacionEncontrada.hotel;
                    Hotel.findById(hotelId, (err, hotelEncontrado) => {
                        if (err) {
                            return res.status(500).send({ message: "Error al buscar hotel" });
                        } else if (hotelEncontrado) {
                            var confServicio = false;
                            hotelEncontrado.servicios.forEach((servicio) => {
                                if (servicio == serviceId) {
                                    confServicio = true;
                                }
                            });
                            if (confServicio == false || confServicio == true) {
                                return res.send({
                                    message: "El servicio no existe en el hotel o ya fue añadido",
                                });
                            } else {
                                if (reservacionEncontrada.usuario == userId) {
                                    total = total + reservacionEncontrada.precio;
                                    console.log(total);
                                    Reservacion.findByIdAndUpdate(reservacionId, {precio: total,$push: { servicios: servicioEncontrado._id },
                                    }, { new: true },(err, reservacionActualizada) => {
                                            if (err) {
                                                console.log(err);
                                                return res.status(500).send({ message: "Error al agregar servicio" });
                                            } else if (reservacionActualizada) {
                                                return res.send({message: "Se agregó el servicio exitosamente",reservacionActualizada,});
                                            } else {
                                                return res.status(500).send({ message: "No se agregó el servicio" });
                                            }
                                        }
                                    );
                                } else {
                                    return res.status(401).send({message: "No tienes permisos para agregar servicios a esta reservación"});
                                }
                            }
                        } else {
                            return res.status(404).send({ message: "Hotel inexistente" });
                        }
                    });
                } else {
                    return res.status(404).send({ message: "No existe la reservación" });
                }
            });
        } else {
            return res.status(404).send({ message: "Servicio no existente" });
        }
    });
}

function createServiceByHotelAdmin(req, res) {
    var service = new Services();
    var params = req.body;
    var userId = req.user.sub;
    var hotelId;
    var services = [];

    if (params.name && params.price_service) {
        Hotel.aggregate([{
            $match: { user_admin_hotel: String(userId) },
        }, ]).exec((err, hotelFinded) => {
            if (err) {
                return res.status(500).send({ message: "Error al buscar hotel" });
            } else if (hotelFinded) {
                console.log(hotelFinded);
                hotelId = hotelFinded[0]._id;
                var confirmation = false;
                Hotel.findById(hotelId)
                    .populate("services")
                    .exec((err, servicesFinded) => {
                        console.log(servicesFinded.services[0]);
                        if (servicesFinded.services.length >= 1) {
                            let i = 0;
                            var name = params.name;
                            while (i < servicesFinded.services.length) {
                                if (servicesFinded.services[i].name == name.toLowerCase()) {
                                    confirmation = true;
                                }
                                i++;
                            }
                            if (confirmation == true) {
                                console.log(hotelFinded[0].services);
                                return res.send({
                                    message: "Este servicio ya existe en el hotel",
                                });
                            } else {
                                service.name = params.name.toLowerCase();
                                service.price_service = params.price_service;
                                service.save((err, serviceSaved) => {
                                    if (err) {
                                        console.log(err);
                                        return res
                                            .status(500)
                                            .send({ ok: false, message: "Error general" });
                                    } else if (serviceSaved) {
                                        var serviceId = serviceSaved._id;
                                        Hotel.findByIdAndUpdate(
                                            hotelId, { $push: { services: serviceId } }, { new: true },
                                            (err, hotelUpdated) => {
                                                if (err) {
                                                    return res
                                                        .status(500)
                                                        .send({ message: "Error al agregar servicio" });
                                                } else if (hotelUpdated) {
                                                    return res.send({
                                                        message: "Servicio agregado exitosamente",
                                                        hotelUpdated,
                                                    });
                                                } else {
                                                    return res.status(500).send({
                                                        message: "No se agregó el servicio al hotel",
                                                    });
                                                }
                                            }
                                        );
                                    } else {
                                        return res.status(404).send({
                                            ok: false,
                                            message: "No se guardo correctamente el servicio",
                                        });
                                    }
                                });
                            }
                        } else {
                            service.name = params.name.toLowerCase();
                            service.price_service = params.price_service;
                            service.save((err, serviceSaved) => {
                                if (err) {
                                    return res
                                        .status(500)
                                        .send({ ok: false, message: "Error general" });
                                } else if (serviceSaved) {
                                    Hotel.findByIdAndUpdate(
                                        hotelId, { $push: { services: serviceSaved._id } }, { new: true },
                                        (err, hotelUpdated) => {
                                            if (err) {
                                                return res
                                                    .status(500)
                                                    .send({ message: "Error al agregar servicio" });
                                            } else if (hotelUpdated) {
                                                return res.send({
                                                    message: "Servicio agregado exitosamente",
                                                    hotelUpdated,
                                                });
                                            } else {
                                                return res.status(500).send({
                                                    message: "No se agregó el servicio al hotel",
                                                });
                                            }
                                        }
                                    );
                                } else {
                                    return res.status(404).send({
                                        ok: false,
                                        message: "No se guardo correctamente el servicio",
                                    });
                                }
                            });
                        }
                    });
            } else {
                return res
                    .status(404)
                    .send({ message: "Su usuario no es administrador de ningún hotel" });
            }
        });
    } else {
        return res
            .status(400)
            .send({ ok: false, message: "Ingrese sus datos obligatorios" });
    }
}

function obtenerServicioHotel(req, res) {
    let userId = req.user.sub;
    if (!userId) {
        return res.json({ message: "Ingrese el id del usuario" });
    } else {
        Hotel.findOne({ gerente: userId }, (err, hotelEncontrado) => {
            if (err) {
                return res.status(500).send({ message: "Error general" });
            } else if (hotelEncontrado) {
                return res.json({message: "Servicios por hotel", servicios: hotelEncontrado.servicios});
            } else {
                return res.json({ message: "No existe el hotel" });
            }
        }).populate("servicios");
    }
}

module.exports = {
    agregarServicio,
    obtenerServicio,
    obtenerServicios,
    agregarServicioAReservacion,
    obtenerServicioHotel,

    createServiceByHotelAdmin,
};