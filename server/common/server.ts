import express from 'express';
import { Application } from 'express';
import http from 'http';
import bodyParser from 'body-parser';

const app = express();

export default class ExpressServer {
    constructor(){
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded());
    } 

    router(routes: (app: Application) => void): ExpressServer{
        routes(app);
        return this;
    } 

    listen(p: string | number = "3000"): Application{
        http.createServer(app).listen(p);
        return app;
    } 
}  