"use strict";

const express = require("express");
const eventoControlador = require("../controladores/evento_controlador");
const mdAuth = require("../middlewares/authenticated");

var api = express.Router();
api.post( "/agregarEvento", [mdAuth.ensureUser, mdAuth.ensureGerente], eventoControlador.agregarEvento);

api.get( "/obtenerEventos", [mdAuth.ensureUser, mdAuth.ensureGerente], eventoControlador.obtenerEventos);

api.get("/obtenerEvento/:id", [mdAuth.ensureUser, mdAuth.ensureGerente], eventoControlador.obtenerEvento);

api.put( "/editarEvento/:id", [mdAuth.ensureUser, mdAuth.ensureGerente], eventoControlador.editarEvento);

api.put( "/eliminarEvento/:id", [mdAuth.ensureUser, mdAuth.ensureGerente],  eventoControlador.eliminarEvento);

module.exports = api;