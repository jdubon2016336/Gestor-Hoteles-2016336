"use strict";

const Hotel = require("../modelos/hotel_modelo");
const Usuario = require("../modelos/usuario_modelo");
const bcrypt = require("bcrypt-nodejs");
const jwt = require("../servicios/jwt");


const pdf = require("pdfkit");
const fs  = require("fs");
var datos;

function pdfHotel(req, res){
    
    if(req.user.rol == "ROL_ADMIN"){
        var hotelId = req.params.id;

    Hotel.findById(hotelId).exec((err, hotelEncontrado) => {
            if (err) return res.status(500).send({  message: "Error general" });
            if (!hotelEncontrado) return res.status(404).send({ message: "No se encontraron hoteles" });
            
        datos = hotelEncontrado;
        var doc = new pdf();
        doc.pipe(fs.createWriteStream('reporte del hotel.pdf'));

        doc.text(`Hotel Detallado :`,{
            align: 'center',
        })

        doc.text(datos,{
            align: 'left'
        });

        doc.end();
        return res.status(200).send({mensaje: "PDF generado"});
        });


}

    }
    

function agregarHotel(req,res){
    if (req.user.rol === "ROL_ADMIN"){
        var hotel = new Hotel();
        var params = req.body;

    if(params.nombre && params.direccion && params.gerente){
        hotel.nombre = params.nombre;
        hotel.direccion = params.direccion;
        hotel.gerente = params.gerente;
        hotel.habitaciones = [];

        Hotel.find({nombreHotel: hotel.nombre}).exec((err, hotelEncontrado)=>{
            if(err) return res.status(500).send({mensaje: 'Error en la solicitud de hoetl'});

            if(hotelEncontrado && hotelEncontrado.length >=1){
                return res.status(200).send({mensaje:'Este hotel ya existe'});
            }else{

                hotel.save((err, hotelGuardado)=>{
                    if(err) return res.status(500).send({mensaje: 'Error al guardar el Hotel'});

                    if (hotelGuardado){
                       return res.status(200).send(hotelGuardado);
                    }else{
                       return res.status(404).send({ mensaje: 'No se ha podido registrar el Hotel'});
                    }
                })
                
            }
        })
    }
    }else{
        return res.status(404).send({ mensaje: 'No tiene permiso para realizar esta acción'});
    }
    
}

function editarHotel(req, res) {
    if (req.user.rol === "ROL_ADMIN"){
    var id = req.params.id;
    var params = req.body;
    
    Hotel.findByIdAndUpdate(id, params, { new: true }, (err, hotelActualizado) => {
        if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
        if (!hotelActualizado) return res.status(500).send({ mensaje: 'No se a podido editar el hotel' });

        return res.status(200).send({ hotelActualizado })
    })
}
  
}

function eliminarHotel(req, res){
    if (req.user.rol === "ROL_ADMIN"){
    var id = req.params.id;

    Hotel.findByIdAndDelete(id, (err, hotelEliminado) =>{
        if(err) return res.status(500).send({mensaje: "Error en la peticion"});
        if(!hotelEliminado) return res.status(500).send({mensaje:"No se ha eliminado el hotel"});

        return res.status(200).send({mensaje: "hotel Eliminado"});
    })
    }
}

function obtenerHoteles(req, res){
    Hotel.find().exec((err, hoteles)=>{
        if(err) return res.status(500).send({ mensaje:"Error al realizar la solicitud de obtener hoteles" });
        if(!hoteles) return res.status(500).send({ mensaje:"No se encontraron hoteles" });

        return res.status(200).send({ hoteles });
    })
}

function obtenerHotel(req, res) {
    let hotelId = req.params.idH;

    Hotel.findById(hotelId).populate("gerente").exec((err, hotel) => {
            if (err) {
                return res.status(500).send({  message: "Error general" });
            } else if (hotel) {
                return res.send({  hotel });
            } else {
                return res.status(404).send({ message: "No se encontraron hoteles" });
            }
        });
}


function encontrarHotel(req, res) {
    var params = req.body;
    var nombre = params.nombre;
    var direccion = params.direccion;

    if(!direccion){
        Hotel.findOne({nombre : params.nombre}, (err, hotelEncontrado)=>{
            if(err) return res.status(500).send({ mensaje:"Error en la peticion" });
            if(!hotelEncontrado) return res.status(500).send({mensaje: 'Error al obtener el Hotel' });
            console.log(hotelEncontrado);
            return res.status(200).send({ hotelEncontrado });
        })
    }else{
        Hotel.findOne({direccion : params.direccion}, (err, hotelEncontrado)=>{
            if(err) return res.status(500).send({ mensaje:"Error en la peticion" });
            if(!hotelEncontrado) return res.status(500).send({mensaje: 'Error al obtener el Hotel' });
            console.log(hotelEncontrado);
            return res.status(200).send({ hotelEncontrado });
        })
        
    }
    

}


function historial(req,res){
    var id = req.user.sub;

    Usuario.findById(id).populate("historial").exec((err,usuarioEncontrado)=>{
        if(err){
            return res.status(500).send({message: "Error al buscar usuario"});
        }else if(usuarioEncontrado){
            return res.send({message: "Hoteles",usuarioEncontrado});
        }else{
            return res.send({message: "Usuario inexistente"});
        }
    })
}

function obtenerHotelesRecomendados(req, res) {
    Hotel.find({}).populate().exec((err, hoteles) => {
            if (err) {
                return res.status(5000).send({ message: "Error general" });
            } else if (hoteles) {
                return res.json({ message: "Hoteles encontrados", hoteles });
            } else {
                return res.json({ message: "No existen hoteles" });
            }
        });
}

function habitacionesPorHotel(req, res) {
    let idH = req.params.idH;
    Hotel.findOne({ _id: idH }, (err, hotelEncontrado) => {
        if (err) {
            res.status(500).send({ message: "Error al buscar hotel" });
            console.log(err);
        } else if (hotelEncontrado) {
            return res.json(hotelEncontrado.habitaciones);
        } else {
            return res.json({message: "El Hotel no tiene habitaciones" });
        }
    }).populate("habitaciones");
}

module.exports = {
    pdfHotel,
    agregarHotel,
    editarHotel,
    eliminarHotel,
    obtenerHoteles,
    obtenerHotel,
    encontrarHotel,
    historial,
    obtenerHotelesRecomendados,
    habitacionesPorHotel
}