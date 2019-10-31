import Server from './common/server';
import routes from './routes';
import { createConnection } from 'typeorm';
import { EstadoReclamo } from './api/model/estadoReclamo';
import EstadoService from './api/services/estado.service';
import UpdateStates from './integrations/updateStates'

const port = process.env.PORT || parseInt("3000");

const actualizarReclamosCsv = () =>{
   let file = "test.csv";
   let updater = new UpdateStates();
   updater.actualizarReclamosCsv(file)
}

createConnection().then(connection => {
    const server : Server = new Server();
    server.router(routes);
    server.listen(port);
    //EstadoService.save(new EstadoReclamo("Estado1"));


   const cron = require("node-cron");
   cron.schedule("* * * * *", function() {
      actualizarReclamosCsv();
    });

 }).catch(err => console.error(err));

 //let updater = new UpdateStates();
/*updater.writeErrorFile("test");*/
//updater.sendEmail("");




