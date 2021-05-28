"use strict";

var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var reservacionSchema = Schema({
    usuario: { type: Schema.ObjectId, ref: "usuario" },
    hotel: { type: Schema.ObjectId, ref: "hotel" },
    habitacion: { type: Schema.ObjectId, ref: "habitacion" },
    fechaInicio: Date,
    fechaFin: Date,
    servicios: [{ type: Schema.ObjectId, ref: "servicios" }],
    eventos: [{ type: Schema.ObjectId, ref: "eventos" }],
    precio: Number,
    libre: { type: Boolean, default: true },
});

module.exports = mongoose.model("reservacion", reservacionSchema);