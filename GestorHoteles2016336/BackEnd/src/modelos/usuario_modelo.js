"use strict"

var mongoose = require("mongoose");
var Schema = mongoose.Schema;


var UsuarioSchema = Schema({
    nombre: String,
    username: String,
    password: String,
    rol: String,
    reservaciones: [{type: Schema.ObjectId, ref: "reservacion"}],
    historial: [{type: Schema.ObjectId, ref: "hotel"}]
});

module.exports = mongoose.model('usuarios', UsuarioSchema);