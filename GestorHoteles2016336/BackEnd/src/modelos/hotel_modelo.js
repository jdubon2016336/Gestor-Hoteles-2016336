"use strict";

var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var hotelSchema = Schema({
    gerente: { type: Schema.ObjectId, ref: "usuario" },
    nombre: String,
    direccion: String,
    reservaciones: {type: Number, default: 0},
    habitaciones: [{ type: Schema.ObjectId, ref: "habitacion" }],
    eventos: [{ type: Schema.ObjectId, ref: "eventos" }],
    servicios: [{type: Schema.ObjectId, ref: "servicios"}]
});

module.exports = mongoose.model("hotel", hotelSchema);