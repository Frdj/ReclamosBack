import { Application } from 'express';
//import examplesRouter from './api/controllers/examples/router';
//import partidoRouter from './api/controllers/partido/router';
import reclamoRouter from './api/controllers/reclamo/router';
//import partidoRouter from './api/controllers/partido/router'
//import sumadorRouter from './api/controllers/sumador/router';

export default function routes(app: Application): void {
app.use('/reclamo', reclamoRouter);
//app.use('/api/v1/partidos', partidoRouter);
//app.use('/api/v1/sumador-de-puntos', sumadorRouter);
};