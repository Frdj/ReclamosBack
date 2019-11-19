
import EstadoService from '../api/services/estado.service';
import ReclamoService from '../api/services/reclamo.service';
import LogService from '../api/services/logs.service';
import { Logs } from '../api/model/logs';

import EmailSender from '../util/emailSender';
import { getType } from 'mime';

//const {successlog, errorlog, integrationslog} = require('../util/logger');
const csv = require('csv-parser');
const fs = require('fs');
var Client = require('ftp');

export default class UpdateStates {
    constructor() {
    }

    public actualizarReclamos(dataList) {
      var arrayErrors = new Array();
      var arraySuccess = new Array(); 

      for (let index = 0; index < dataList.length; index++) {
        const data = dataList[index];
        console.log(data);
        data[1] = data[1].replace("\"","")
        EstadoService.findByDescription(data[1])
        .then(estado => {
            if(!estado){
              LogService.save(new Logs("Error",`No existe el estado ${data[1]}`));
            }
            else{
              ReclamoService.findByNroOrden(data[0])
              .then(reclamo => {
                if(!reclamo){
                  LogService.save(new Logs("Error",`No existe el reclamo ${data[0]}`));
                }
                else{
                  if(reclamo.estado.id != estado.id){
                    reclamo.estado.id = estado.id;
                    ReclamoService.update(reclamo.id,reclamo);
                    if(estado.descripcion.toLowerCase() == "retiro pendiente"){
                      this.sendEmail(reclamo.usuario.nombre + "!, El grupo de logistica ya esta en camino!",reclamo.nroOrden,reclamo.usuario.email);
                    }
                  }
                }
              })
              .catch(err =>{
                LogService.save(new Logs("Error",`Hubo un error en la busqueda del reclamo. Nro orden: ${data[0]} - Estado: ${data[1]}. Detalle del error ${err.toString}`));
              })
            }
        })
        .catch(err =>{
          LogService.save(new Logs("Error",`Hubo un error en la busqueda del estado. Nro orden: ${data[0]} - Estado: ${data[1]}. Detalle del error ${err.toString}`));
        })
      }
    }

    public sendEmail(mensaje,nroReclamo, email):String{
      //integrationslog.error(mensaje);
      console.log("Envio mail")
      return EmailSender.sendEmail(mensaje,nroReclamo, email);
    }

    public readCsv(){
      const jsftp = require("jsftp");
      const Ftp = new jsftp({
        host: "f24-preview.runhosting.com",
        user: "3203234_clientes",
        pass: "clientes123"
      });
      var file = "/ejemplo.csv";
      var str = ""; // Will store the contents of the file
      Ftp.get(file, (err, socket) => {
        if (err) {
          LogService.save(new Logs("Error",`Fallo en el get del archivo ${file} - ${err}`));
          return;
        }
      
        socket.on("data", d => {
          let aux = d.toString();
          console.log(d);
          str += (d.toString());
        });
      
        socket.on("close", err => {
          if (err) {
            console.error("Error en el cierre del socket.");
            LogService.save(new Logs("Error",`Error en el cierre del socket. ${err}`));
          }
          else{
            console.log("parsing...");
            let res = new Array();
            let array = str.split("\n");

            let estadosLogistica = {
              "En preparacion" : "Retiro Pendiente",
              "En viaje" : "Retiro Pendiente",
              "Entregado" : "Finalizado",
              "A retirar en domicilio" : "Retiro Pendiente",
              "Retirado" : "Retirado"
            };
            for (let i = 1; i < array.length; i++) {   
              let aux = new Array();       
              let element = array[i].split(",");
              aux.push("45872");//element[0].replace(/"/g,'')
              aux.push(estadosLogistica[element[1].replace(/"/g,'')]);

              res.push(aux);//Nro de orden, estado pedido
            }
            console.table(res);
            this.actualizarReclamos(res)
          }
          console.log("Socket cerrado");
          LogService.save(new Logs("Success",`Cierre de conexion exitosa`));
        });
      
        socket.resume();
      });
    }

}
