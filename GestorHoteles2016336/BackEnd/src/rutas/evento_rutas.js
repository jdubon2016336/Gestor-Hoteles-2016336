"use strict";

const express = require("express");
const eventoControlador = require("../controladores/evento_controlador");
const mdAuth = require("../middlewares/authenticated");

var api = express.Router();
api.post( "/agregarEvento", mdAuth.ensureUser, eventoControlador.agregarEvento);

api.get( "/obtenerEventos", mdAuth.ensureUser, eventoControlador.obtenerEventos);

api.get("/obtenerEvento/:id", mdAuth.ensureUser, eventoControlador.obtenerEvento);

api.put( "/editarEvento/:id", mdAuth.ensureUser, eventoControlador.editarEvento);

api.put( "/eliminarEvento/:id", mdAuth.ensureUser,  eventoControlador.eliminarEvento);

module.exports = api;