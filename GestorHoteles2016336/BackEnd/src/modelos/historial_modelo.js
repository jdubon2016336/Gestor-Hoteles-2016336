'use strict'

var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var HistorialSchema = Schema({
    idUsuario: { type: Schema.Types.ObjectId, ref: 'usuarios' },
    HotelHistorial: [{
        hotelNombre: { type: Schema.Types.String, ref: 'hoteles' }
    }],
});

module.exports = mongoose.model('historiales', HistorialSchema);