"use strict"

var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var servicioSchema = Schema({
    nombre: String,
    precio: Number
});

module.exports = mongoose.model("servicio",servicioSchema);