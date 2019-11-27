'use strict'
var jwt = require('jwt-simple');
var moment = require('moment');
var secret = 'ecca2947003142d9a7d9da17703246bf';
var tiendaSecret = '12jnedoid1n32ñrn32noido12inekm32n2oif2in1';

exports.ensureAuth = function (req, res, next) {
    if (!req.headers.authorization) {
        return res.status(403).send({ message: 'La peticion no tiene la cabecera de autenticación' });
    } else {
        var token = req.headers.authorization.replace(/['"]+/g, '');
        try {
            var payload = jwt.decode(token, secret);

        } catch (ex) {
            return res.status(401).send({
                message: 'El token no es valido'
            });
        }
        req.user = payload;
        next();
    }
}

exports.tiendaKey = function (req, res, next) {
    if (!req.headers.authorization) {
        return res.status(403).send({ message: 'La peticion no tiene la cabecera de autenticación' });
    } else {
        var token = req.headers.authorization.replace(/['"]+/g, '');
        try {
            var payload = jwt.decode(token, tiendaSecret);

        } catch (ex) {
            return res.status(401).send({
                message: 'El token no es valido'
            });
        }
        req.user = payload;
        next();
    }
}
