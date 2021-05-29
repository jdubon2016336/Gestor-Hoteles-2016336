"use strict";

const express = require("express");
const usuarioControlador = require("../controladores/usuario_controlador");
const mdAuth = require("../middlewares/authenticated");

var api = express.Router();

api.post("/registrar", usuarioControlador.registrar);
api.post("/login", usuarioControlador.login );
api.put("/editarUsuario/:id", usuarioControlador.editarUsuario);
api.put("/eliminarUsuario/:id", usuarioControlador.eliminarUsuario);
api.get("/obtenerUsuarios", mdAuth.ensureUser,usuarioControlador.obtenerUsuarios);
api.get("/obtenerusuario/:id", mdAuth.ensureUser, usuarioControlador.obtenerUsuario);
api.get( "/obtenerGerentes", mdAuth.ensureUser, usuarioControlador.obtenerGerentes);


module.exports = api;