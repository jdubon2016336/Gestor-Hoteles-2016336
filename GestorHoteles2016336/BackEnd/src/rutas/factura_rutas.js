"use strict"

const express = require("express");
const facturaControlador = require("../controladores/factura_controlador");
const mdAuth = require("../middlewares/authenticated");

var api = express.Router();

api.post("/agregarFactura/:idR",[mdAuth.ensureUser, mdAuth.ensureGerente], facturaControlador.agregarFactura);

api.get("/obtenerFacturasGerente",[mdAuth.ensureUser,mdAuth.ensureGerente], facturaControlador.obtenerFacturasGerente);

api.get("/obtenerFactura/:id",[mdAuth.ensureUser,mdAuth.ensureGerente], facturaControlador.obtenerFactura);

api.get("/obtenerFacturasUsuario",[mdAuth.ensureUser], facturaControlador.obtenerFacturasCliente);

api.get("/obtenerFacturaUuario/:id",[mdAuth.ensureUser], facturaControlador.obtenerFacturaCliente);

module.exports = api;