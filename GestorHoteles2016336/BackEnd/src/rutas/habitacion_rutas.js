"use strict";

const express = require("express");
const habitacionControlador = require("../controladores/habitacion_controlador");
const mdAuth = require("../middlewares/authenticated");

var api = express.Router();

api.post("/agregarHabitacion/:idH", mdAuth.ensureUser, habitacionControlador.agregarHabitacion);

api.post("/editarHabitacion/:idR", mdAuth.ensureUser, habitacionControlador.editarHabitacion);

api.put("/eliminarHabitacion/:idR", mdAuth.ensureUser,  habitacionControlador.eliminarHabitacion);

api.get("/obtenerHabitaciones", mdAuth.ensureUser, habitacionControlador.obtenerHabitaciones);

api.get("/obtenerHabitacion/:idR", mdAuth.ensureUser,habitacionControlador.obtenerHabitacion);

api.get("/obtenerEventosPorHabitacion", mdAuth.ensureUser, habitacionControlador.obtenerEventosPorHabitacion );

module.exports = api;