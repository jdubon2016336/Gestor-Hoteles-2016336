"use strict";

var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var habitacionSchema = Schema({
    nombre: String,
    disponible: { type: Boolean, default: true },
    precio: Number,
    dias: { type: Date, default: null},
});

module.exports = mongoose.model("habitacion", habitacionSchema);