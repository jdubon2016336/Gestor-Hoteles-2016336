"use strict";

const Hotel = require("../modelos/hotel_modelo");
const Reservacion = require("../modelos/reservacion_modelo");
const Habitacion = require("../modelos/habitacion_modelo");
const Factura = require("../modelos/factura_modelo");
const moment = require("moment");


function agregarFactura(req, res) {
    if(req.user.rol === "ROL_GERENTE"){
        var reservacionId = req.params.idR;
    var id = req.user.sub;

    Hotel.findOne({ gerente: id }).exec((err, hotelEncontrado) => {
        if (err) {
            return res.status(500).send({ message: "Error al buscar hotel" });
        } else if (hotelEncontrado) {
            Reservacion.findById(reservacionId, (err, reservacionEncontrada) => {
                if (err) {
                    return res.status(500).send({ message: "Error al buscar reservación" });

                } else if (reservacionEncontrada) {
                    var habitacionId = reservacionEncontrada.habitacion;
                    if (reservacionEncontrada.libre == true) {
                        var inicio = new Date(moment(reservacionEncontrada.fechaInicio).format("YYYY-MM-DD"));
                        var hoy = new Date(moment().format("YYYY-MM-DD"));
                        if (hoy <= inicio) {
                            return res.send({ message: "Aún no es día de retiro, no se puede pagar"});
                        } else {
                            Habitacion.findByIdAndUpdate(habitacionId, { disponible: true, dias: null }, { new: true },(err, habitacionActualizada) => {
                                    if (err) {
                                        return res.status(500).send({ message: "Error al buscar habitación" });
                                    } else if (habitacionActualizada) {
                                        Reservacion.findByIdAndUpdate(reservacionId, { status: false }, { new: true },(err, reservacionActualizada) => {
                                                if (err) {
                                                    return res.status(500).send({message: "Error al intentar actualizar reservación"});

                                                } else if (reservacionActualizada) {
                                                    var factura = new Factura();

                                                    factura.fechaInicio = reservacionActualizada.fechaInicio;
                                                    factura.fechaFin = reservacionActualizada.fechaFin;
                                                    factura.precioTotal = reservacionActualizada.precioTotal;
                                                    factura.usuario = reservacionActualizada.usuario;
                                                    factura.hotel = reservacionActualizada.hotel;
                                                    factura.habitacion = reservacionActualizada.habitacion;
                                                    factura.servicios = reservacionActualizada.servicios;
                                                    if (reservacionActualizada.eventos != undefined) {
                                                        factura.eventos = reservacionActualizada.eventos;
                                                    }
                                                    factura.save((err, facturaGuardada) => {
                                                        if (err) {
                                                            console.log(err);
                                                            return res.status(500).send({ message: "Error al facturar" });
                                                        } else if (facturaGuardada) {
                                                            return res.send({ message: "Facturado exitosamente",facturaGuardada});
                                                        } else {
                                                            return res.status(500).send({ message: "No se facturó" });
                                                        }
                                                    });
                                                } else {
                                                    return res.status(404).send({ message: "Reservación inexistente" });
                                                }
                                            }
                                        );
                                    } else {
                                        return res.status(404).send({ message: "Habitación inexistente" });
                                    }
                                }
                            );
                        }
                    } else {
                        return res.send({ message: "Esta reservación ya fue pagada" });
                    }
                } else {
                    return res.status(404).send({ message: "Reservación inexistente" });
                }
            });
        } else {
            return res.status(404).send({ message: "No es gerente de ningún hotel" });
        }
    });
}

    }
    
function obtenerFacturasGerente(req, res) {
    var id = req.user.sub;

    Hotel.findOne({ gerente: id }, (err, hotelEncontrado) => {
        if (err) {
            return res.status(500).send({ message: "Error al buscar hotel" });
        } else if (hotelEncontrado) {
            var hotelId = hotelEncontrado._id;
            console.log(hotelId);
            Factura.find({ hotel: hotelId }).exec((err, facturas) => {
                if (err) {
                    return res.status(500).send({ message: "Error al obtener facturas" });
                } else if (facturas) {
                    return res.send({ message: "Facturas: ", facturas });
                } else {
                    return res.send({ message: "No hay facturas" });
                }
            });
        } else {
            return res.status(404).send({ message: "No es administrador de ningún hotel" });
        }
    });
}

function obtenerFactura(req, res) {
    var id = req.user.sub;
    var facturaId = req.params.id;

    Hotel.findOne({ gerente: id }, (err, hotelEncontrado) => {
        if (err) {
            return res.status(500).send({ message: "Error al buscar hotel" });
        } else if (hotelEncontrado) {
            var hotelId = hotelEncontrado._id;
            console.log(hotelId);
            Factura.findById(facturaId)
                .populate("servicios")
                .exec((err, factura) => {
                    if (err) {
                        return res.status(500).send({ message: "Error al buscar factura" });
                    } else if (factura) {
                        return res.send({ message: "Factura: ", factura });
                    } else {
                        return res.send({ message: "Factura inexistente" });
                    }
                });
        } else {
            return res.status(404).send({ message: "No es administrador de ningún hotel" });
        }
    });
}

function obtenerFacturasCliente(req, res) {
    var usuarioId = req.user.sub;

    Factura.find({ usuario: usuarioId }).populate("servicios") .populate("hotel").populate("hotel.eventos")
        .populate("hotel.habitaciones").populate("hotel.servicios").populate("hotel.gerente").populate("habitacion")
        .populate("usuario").exec((err, facturas) => {
            if (err) {
                return res.status(500).send({ message: "Error al obtener facturas" });
            } else if (facturas) {
                return res.send({ message: "Facturas: ", facturas });
            } else {
                return res.send({ message: "No hay facturas" });
            }
        });
}

function obtenerFacturaCliente(req, res) {
    var facturaId = req.params.id;
    Invoice.findById(facturaId).populate("servicios").populate("hotel").populate("habitacion").populate("usuario")
        .exec((err, factura) => {
            if (err) {
                return res.status(500).send({ message: "Error al buscar factura" });
            } else if (factura) {
                return res.send({ message: "Factura: ", factura });
            } else {
                return res.send({ message: "Factura inexistente" });
            }
        });
}

module.exports = {
   agregarFactura,
   obtenerFactura,
   obtenerFacturasGerente,
   obtenerFacturaCliente,
   obtenerFacturasCliente
};