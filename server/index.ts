import Server from './common/server';
import routes from './routes';
import { createConnection } from 'typeorm';
const port = process.env.PORT || parseInt("3000");

 createConnection().then(connection => {
    const server : Server = new Server();
    server.router(routes);
    server.listen(port);
 }).catch(err => console.error(err));