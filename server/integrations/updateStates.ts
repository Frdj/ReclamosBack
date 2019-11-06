
import EstadoService from '../api/services/estado.service';
import ReclamoService from '../api/services/reclamo.service';
import EmailSender from '../util/emailSender';

const {successlog, errorlog, integrationslog} = require('../util/logger');
const csv = require('csv-parser');
const fs = require('fs');

export default class UpdateStates {
    pendingPath = "server/Inbound/Pending/";
    processedPath = "server/Inbound/Processed/";

    constructor() {
    }

    public actualizarReclamosCsv(file) {
      let pathToFile = this.pendingPath + "/" + file;
      if (fs.existsSync(pathToFile)) {
        let errors = false;
        fs.createReadStream(pathToFile)
        //headers: false le indicas que no hay headers
        //["Header1","Header2"] le indicas cuales seran los headers (no es necesario en el csv)
        .pipe(csv( { separator: ';', headers: false}))
        .on('data', (data) => {
          //console.log(data[1])
          EstadoService.findByDescription(data[1])
          .then(estado => {
            if(!estado){
              integrationslog.error(`No existe el estado ${data[1]}`);
              errors = true;
            }
            else{
              ReclamoService.findByNroOrden(data[0])
              .then(reclamo => {
                if(!reclamo){
                  integrationslog.error(`No existe el reclamo ${data[0]}`);
                  errors = true;
                }
                else{
                  reclamo.estado.id = estado.id;
                  ReclamoService.update(reclamo.id,reclamo)
                  ;
                  if(estado.descripcion.toLowerCase() == "finalizado"){
                    this.sendEmail(reclamo.usuario.nombre + "!, El grupo de logistica ya esta en camino!",reclamo.nroOrden,reclamo.usuario.email)
                    successlog.info("Enviando mail")
                  }
                }
              })
              .catch(err =>{
                errorlog.error(err)
                errors = true;
              })
            }
          })
          .catch(err =>{
            errorlog.error(err)
            errors = true;
          })
        })
        .on('end', () => {
          successlog.info("Lectura del archivo finalizada");
          this.copyFileToProcessed(file,errors);
        });
      }
      else{
        integrationslog.error(`No se a encontrado el archivo ${file}`);
      }
    }

    private copyFileToProcessed(file, errors){    
      let fileArray = file.split(".");
      let date = new Date();
      let fecha;
      if(errors){
        fecha = date.getFullYear().toString() + (date.getMonth()+1).toString() + date.getDate().toString() + "_" + date.getHours().toString() + date.getMinutes().toString() + date.getSeconds().toString() + " - with errors";
      }
      else{
        fecha = date.getFullYear().toString() + (date.getMonth()+1).toString() + date.getDate().toString() + "_" + date.getHours().toString() + date.getMinutes().toString() + date.getSeconds().toString();
      }
        fs.rename(this.pendingPath + file, this.processedPath + fileArray[0] + " - " + fecha + ".csv", (err)=>{
        if(err) throw err;
        else console.log('Successfully moved');
      });

    }

    public sendEmail(mensaje,nroReclamo, email){
      //integrationslog.error(mensaje);
      EmailSender.sendEmail(mensaje,nroReclamo, email);
    }

}
