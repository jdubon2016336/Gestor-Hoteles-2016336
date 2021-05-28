"use strict"

var mongoose = require("mongoose");
var Schema = mongoose.Schema;


var facturaSchema = Schema({
    fechaInicio: Date,
    fechaFin: Date,
    precioTotal: Number,
    usuario: {type: Schema.ObjectId, ref:"user"},
    hotel: {type: Schema.ObjectId, ref:"hotel"},
    habitacion: {type: Schema.ObjectId, ref:"room"},
    servicios: [{type: Schema.ObjectId, ref:"service"}],
    eventos: [{type: Schema.ObjectId, ref:"event"}]
});

module.exports = mongoose.model("factura",facturaSchema);