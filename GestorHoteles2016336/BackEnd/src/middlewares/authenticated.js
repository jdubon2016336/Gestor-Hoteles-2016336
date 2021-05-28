"use strict";

var jwt = require("jwt-simple");
var moment = require("moment");
var secret = "clave_secreta";

exports.ensureUser = (req, res, next) => {
    if (!req.headers.authorization) {
        return res.status(403).send({ message: "La petición no lleva cabecera de autenticación ----" });
    } else {
        var token = req.headers.authorization.replace(/['"']+/g, "");
        try {
            var payload = jwt.decode(token, secret);
            if (payload.exp <= moment().unix()) {
                return res.status(401).send({ message: "Token ha expirado" });
            }
        } catch (err) {
            return res.status(404).send({ message: "Token inválido" });
        }

        req.user = payload;
        next();
    }
};

exports.ensureAdmin = (req, res, next) => {
    var payload = req.user;

    if (payload.rol != "ROL_ADMIN") {
        return res.status(404).send({ message: "No tienes permiso para ingresar a esta ruta" });
    } else {
        return next();
    }
};

exports.ensureGerente = (req, res, next) => {
    var payload = req.user;

    if (payload.rol != "ROL_GERENTE") {
        return res.status(404).send({message: "No tienes permiso para ingresar a esta ruta"});
    } else {
        return next();
    }
};

exports.ensureAdminOrGerente = (req, res, next) => {
    var payload = req.user;

    if (payload.rol != "ROL_GERENTE" && payload.rol != "ROL_ADMIN") {
        return res.status(404).send({message: "No tienes permiso para ingresar a esta ruta "});
    } else {
        return next();
    }
};