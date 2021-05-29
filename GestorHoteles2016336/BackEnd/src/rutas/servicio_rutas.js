"use strict";

const express = require("express");
const servicioControlador = require("../controladores/servicio_controlador");
const mdAuth = require("../middlewares/authenticated");

var api = express.Router();

api.post("/agregarServicio/:idH", mdAuth.ensureUser, servicioControlador.agregarServicio);

api.get("/obtenerServicios",mdAuth.ensureUser, servicioControlador.obtenerServicios);

api.get("/obtenerServicio/:id", mdAuth.ensureUser, servicioControlador.obtenerServicio);

api.put( "/:idR/agregarServicioAReservacion/:idS", mdAuth.ensureUser,servicioControlador.agregarServicioAReservacion);

api.get("/obtenerServicioHotel", mdAuth.ensureUser, servicioControlador.obtenerServicioHotel);


module.exports = api;