"use strict";

const express = require("express");
const hotelControlador = require("../controladores/hotel_controlador");
const mdAuth = require("../middlewares/authenticated");

let api = express.Router();

api.post("/agregarHotel", [mdAuth.ensureUser, mdAuth.ensureAdmin], hotelControlador.agregarHotel);

api.post("/editarHotel/:idH", [mdAuth.ensureUser, mdAuth.ensureAdmin], hotelControlador.editarHotel);

api.delete("/eliminarHotel/:idH", [mdAuth.ensureUser, mdAuth.ensureAdmin], hotelControlador.eliminarHotel);

api.get("/obtenerHoteles", hotelControlador.obtenerHoteles );

api.get("/obtenerHotel/:idH", [mdAuth.ensureUser], hotelControlador.obtenerHotel);

api.get("/encontrarHotel", [mdAuth.ensureUser, mdAuth.ensureAdminOrAdminHotel], hotelControlador.encontrarHotel);

api.get( "/historial", [mdAuth.ensureUser], hotelControlador.historial);

api.get("/obtenerHotelesRecomendados", hotelControlador.obtenerHotelesRecomendados);

api.get( "/habitacionesPorHotel/:idH", [mdAuth.ensureUser], hotelControlador.habitacionesPorHotel);

module.exports = api;