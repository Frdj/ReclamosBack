import express from 'express';
import reclamoController from './reclamoController';

var md_auth = require('../../../middleware/authenticate');

export default express.Router()
.get('/:id', md_auth.ensureAuth, reclamoController.findOne)
.post('/', md_auth.ensureAuth, reclamoController.save)
.put('/:id', md_auth.ensureAuth, reclamoController.update)
.delete('/:id', md_auth.ensureAuth, reclamoController.remove)
.get('/', md_auth.ensureAuth, reclamoController.getAll);
