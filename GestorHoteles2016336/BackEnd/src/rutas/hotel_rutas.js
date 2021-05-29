"use strict";

const express = require("express");
const hotelControlador = require("../controladores/hotel_controlador");
const mdAuth = require("../middlewares/authenticated");

let api = express.Router();

api.post("/agregarHotel", mdAuth.ensureUser, hotelControlador.agregarHotel);

api.post("/editarHotel/:idH", mdAuth.ensureUser, hotelControlador.editarHotel);

api.delete("/eliminarHotel/:idH", mdAuth.ensureUser, hotelControlador.eliminarHotel);

api.get("/obtenerHoteles", hotelControlador.obtenerHoteles );

api.get("/obtenerHotel/:idH", mdAuth.ensureUser, hotelControlador.obtenerHotel);

api.get("/encontrarHotel", hotelControlador.encontrarHotel);

api.get( "/historial", mdAuth.ensureUser, hotelControlador.historial);

api.get("/obtenerHotelesRecomendados", hotelControlador.obtenerHotelesRecomendados);

api.get( "/habitacionesPorHotel/:idH", mdAuth.ensureUser, hotelControlador.habitacionesPorHotel);

api.get("/pdfHotel/:id", mdAuth.ensureUser, hotelControlador.pdfHotel);

module.exports = api;