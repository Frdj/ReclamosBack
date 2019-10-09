import { Application } from 'express';
import reclamoRouter from './api/controllers/reclamo/router';
import swaggerUi from 'swagger-ui-express'
import * as swaggerDocument from './swagger.json'

export default function routes(app: Application): void {
    app.use('/reclamo', reclamoRouter);
    app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
};