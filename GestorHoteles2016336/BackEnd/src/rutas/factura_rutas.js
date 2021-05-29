"use strict"

const express = require("express");
const facturaControlador = require("../controladores/factura_controlador");
const mdAuth = require("../middlewares/authenticated");

var api = express.Router();

api.post("/agregarFactura/:idR",mdAuth.ensureUser, facturaControlador.agregarFactura);

api.get("/obtenerFacturasGerente",mdAuth.ensureUser, facturaControlador.obtenerFacturasGerente);

api.get("/obtenerFactura/:id",mdAuth.ensureUser, facturaControlador.obtenerFactura);

api.get("/obtenerFacturasUsuario",mdAuth.ensureUser, facturaControlador.obtenerFacturasCliente);

api.get("/obtenerFacturaUuario/:id",mdAuth.ensureUser, facturaControlador.obtenerFacturaCliente);

module.exports = api;