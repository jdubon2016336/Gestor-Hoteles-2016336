"use strict";

const express = require("express");
const reservacionControlador = require("../controladores/reservacion_controlador");
const mdAuth = require("../middlewares/authenticated");

var api = express.Router();

api.post( "/:idH/agregarReservacion/:idU/:idR", mdAuth.ensureUser, reservacionControlador.agregarReservacion );

api.put("/cancelarReservacion/:idRes", mdAuth.ensureUser, reservacionControlador.cancelarReservacion);

api.get( "/obtenerReservacionesPorHotel", mdAuth.ensureUser, reservacionControlador.obtenerReservacionesPorHotel);

api.get( "/obtenerReservacionUsuario", mdAuth.ensureUser, reservacionControlador.obtenerReservacionUsuario);

module.exports = api;