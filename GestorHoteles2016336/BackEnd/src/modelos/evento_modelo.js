"use strict";

var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var eventoSchema = Schema({
    nombre: String,
    tipo: {type: String, default: "Privado"}
});

module.exports = mongoose.model("evento", eventoSchema);