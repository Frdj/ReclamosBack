import express from 'express';
import reclamoController from './reclamoController';

export default express.Router()
.get('/:id',reclamoController.findOne)
.post('/save',reclamoController.save)
.put('/:id',reclamoController.update)
.delete('/:id', reclamoController.remove)
.get('/',reclamoController.getAll);