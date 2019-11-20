
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

    public actualizarReclamos2(dataList) {
      var arrayErrors = new Array();
      var arraySuccess = new Array(); 

      for (let index = 0; index < dataList.length; index++) {
        const data = dataList[index];
        data[1] = data[1].replace("\"","")
        EstadoService.findByDescription(data[1])
        .then(estado => {
            if(!estado){
              LogService.save(new Logs("Error",`Actualizando No existe el estado ${data[1]}`));
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

    async actualizarReclamos(dataList) {
      for (let data of dataList) {
        await ReclamoService.findByNroOrden(data[0])
        .then(reclamo => {
          if(!reclamo){
            LogService.save(new Logs("Error",`No existe el reclamo ${data[0]}`));
          }
          else{
            EstadoService.findByDescription(data[1])
            .then(estado => {
                if(!estado){
                  LogService.save(new Logs("Error",`Nro orden ${data[0]}: No existe el estado ${data[1]}`));
                }
                else{
                  if(reclamo.estado.id != 4){
                    if(reclamo.estado.id != estado.id){
                      reclamo.estado.id = estado.id;
                      ReclamoService.update(reclamo.id,reclamo);
                    
                      if(estado.descripcion.toLowerCase() == "retiro pendiente"){
                        this.sendEmail(reclamo.usuario.nombre + "!, El grupo de logistica ya esta en camino!",reclamo.nroOrden,reclamo.usuario.email);
                      }
                    }
                    else{
                      LogService.save(new Logs("Info",`Nro orden ${data[0]}: Estado de orden al dia => ${data[1]} = ${estado.descripcion}`));
                    }
                  }
                  else{
                    LogService.save(new Logs("Info",`Nro orden ${data[0]}: No se actualiza al estado ${data[1]} porque se encuentra cancelada`));
                  }
                }
            })
            .catch(err =>{
              LogService.save(new Logs("Error",`Nro orden ${data[0]} - Estado ${data[1]}: Hubo un error en la busqueda del estado. Detalle del error ${err.toString}`));
            })
          }
        })
        .catch(err =>{
          LogService.save(new Logs("Error",`Nro orden ${data[0]} - Estado ${data[1]}: Hubo un error en la busqueda del reclamo. Detalle del error ${err.toString}`));
        })
      }
      //LogService.save(new Logs("Info",`Corrida completada. ${total} registros - ${correctos} correctos - ${fallas} fallas - ${neutros} neutros`));
    }

    public sendEmail(mensaje,nroReclamo, email):String{
      //integrationslog.error(mensaje);
      return EmailSender.sendEmail(mensaje,nroReclamo, email);
    }

    public readCsv(){
      const jsftp = require("jsftp");
      const Ftp = new jsftp({
        host: "f24-preview.runhosting.com",
        user: "3203234_clientes",
        pass: "clientes123"
      });
      var file = "info.csv";
      var str = ""; // Will store the contents of the file
      Ftp.get(file, (err, socket) => {
        if (err) {
          LogService.save(new Logs("Error",`Fallo en el get del archivo ${file} - ${err}`));
          return;
        }
      
        socket.on("data", d => {
          str += (d.toString());
        });
      
        socket.on("close", err => {
          if (err) {
            LogService.save(new Logs("Error",`Error en el cierre del socket. ${err}`));
          }
          else{
            let res = new Map();
            let array = str.split("\n");
            let estadosLogistica = {
              "En preparación" : "Ingresado",
              "En viaje" : "Retiro Pendiente",
              "Entregado" : "Finalizado",
              "A retirar en domicilio" : "Retiro Pendiente",
              "Retirado" : "Retirado"
            };
            for (let i = 1; i < array.length; i++) {   
              let element = array[i].split(",");
              if(element && element[0] != ''){           
                let estado = estadosLogistica[element[1].replace(/"/g,'')];
                if((estado == "Retiro Pendiente" || estado == "Retirado") && !res.has(element[0])){
                  res.set(element[0],[element[0],estado]);
                }
              }
            }

            this.actualizarReclamos(res.values());
          }
          LogService.save(new Logs("Success",`Cierre de conexion exitosa`));
        });
      
        socket.resume();
      });
    }

}
