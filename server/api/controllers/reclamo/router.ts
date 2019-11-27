import express from 'express';
import reclamoController from './reclamoController';
var cors = require('cors')
var md_auth = require('../../../middleware/authenticate');
var corsOptions = { origin: true }
export default express.Router()
.post('/tienda/',cors(corsOptions), reclamoController.saveTienda)
.post('/setCron',cors(corsOptions),reclamoController.setCronTime)
.get('/orden/:id',cors(corsOptions), reclamoController.findOneByOrden)
.get('/:id',cors(corsOptions), md_auth.ensureAuth, reclamoController.findOne)
.post('/',cors(corsOptions), md_auth.ensureAuth, reclamoController.save)
.put('/:id',cors(corsOptions), md_auth.ensureAuth, reclamoController.update)
.delete('/:id',cors(corsOptions), md_auth.ensureAuth, reclamoController.remove)
.get('/', cors(corsOptions), md_auth.ensureAuth, reclamoController.getAll);

