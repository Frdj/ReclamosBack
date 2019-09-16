import express from 'express';
import { Application } from 'express';
import http from 'http';
import bodyParser from 'body-parser';

const app = express();

export default class ExpressServer {
    constructor() {
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded());
        // CORS
        app.use((req, res, next) => {
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
            res.header("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS");
            next();
        });
    }

    router(routes: (app: Application) => void): ExpressServer {
        routes(app);
        return this;
    }

    listen(p: string | number = "3000"): Application {
        http.createServer(app).listen(p);
        return app;
    }
}  