"use strict";

const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");

const usuarioRutas = require("./src/rutas/usuario_rutas");
const eventoRutas = require("./src/rutas/evento_rutas");
const hotelRutas = require("./src/rutas/hotel_rutas");
const facturaRutas = require("./src/rutas/factura_rutas");
const reservacionRutas = require("./src/rutas/reservacion_rutas");
const habitacionRutas = require("./src/rutas/habitacion_rutas");
const servicioRutas = require("./src/rutas/servicio_rutas");


app.use(cors({ origin: true, credentials: true }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use("/api", usuarioRutas);
app.use("/api", eventoRutas);
app.use("/api", hotelRutas);
app.use("/api", facturaRutas);
app.use("/api", reservacionRutas);
app.use("/api", habitacionRutas);
app.use("/api", servicioRutas);

module.exports = app;