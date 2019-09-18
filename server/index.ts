import Server from './common/server';
import routes from './routes';
import { createConnection } from 'typeorm';
import { EstadoReclamo } from './api/model/estadoReclamo';
import EstadoService from './api/services/estado.service';

const port = parseInt("3000");

 createConnection().then(connection => {
    const server : Server = new Server();
    server.router(routes);
    server.listen(port);
    //EstadoService.save(new EstadoReclamo("Estado1"));
 }).catch(err => console.error(err));