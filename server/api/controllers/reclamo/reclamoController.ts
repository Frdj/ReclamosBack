import ReclamoService from '../../services/reclamo.service';
import UsuarioService from '../../services/usuario.service';
import { Request, Response } from 'express';
import { Reclamo } from '../../model/reclamo';
import { ResponseCode } from '../../dtos/response-codes.enum';
import { Usuario } from '../../model/usuario';
import { EstadoReclamo } from '../../model/estadoReclamo';
import UpdateStates from '../../../integrations/updateStates';
import LogService from '../../services/logs.service';
import {Logs} from '../../model/logs';
var job;
var period = 2;
var CronJob = require('cron').CronJob;
const axios = require('axios');

async function getDatosTienda(id: number){
  return axios.get(`http://shop-uade-be.herokuapp.com/claims/orders/${id}`)
  .then(response => {
    if(response.status == 200){
      let direccion = response.data.buyer.addresses[0];
      //post a logistica
      return {  
        "nombre" : response.data.buyer.name,
        "logistica": {      
          "address" : {
            "city": direccion.city,
            "state": direccion.state,
            "street": direccion.street,
            "zipCode": direccion.zipCode
          },
          "buyerId" : response.data.buyer.id,
          "email" : response.data.buyer.email,
          "itemId" : response.data.item.id,
          "orderId" : id,
          "quantity" : response.data.quantity,
          "weight" : response.data.item.weight      
        }
      }
    }
    else{
      console.log(response);
      return {
        "message" : `Error al recuperar el reclamo de tienda. ${response.status}`
      }
    }            
  })
  .catch(error => {
    console.log("pasa por aca")
    return error;
});
}

async function doPostLogistica(data){
  return axios.post("https://logistica-integracion.herokuapp.com/order/reclamos/receive",{    
      "address" : data.address,
      "buyerId": data.buyerId,
      "email": data.email,
      "itemId": data.itemId,
      "orderId": data.orderId,
      "quantity": data.quantity,
      "weight": data.weight
  })
  .then(res => {
    return res.status;
  })
  .catch(error => {
    return error;
  })
 }

export class ReclamoController {
  /**
   * BuscarReclamo Funcionando
   */
  findOne(req: Request, res: Response): void {
    const id = parseInt(req.params.id);
    ReclamoService.findOne(id)
      .then(r => {
        if (!r) {
          res.status(ResponseCode.NotFound).end();
        } else {
          res.json(r);
        }
      })
      .catch(err => res.status(ResponseCode.InternalServerError).end());
  }

  findOneByOrden(req: Request, res: Response): void {
    const id = parseInt(req.params.id);
    ReclamoService.findOneByOrden(id)
      .then(r => {
        if (!r) {
          res.status(ResponseCode.NotFound).end();
        } else {
          res.json(r);
        }
      })
      .catch(err => res.status(ResponseCode.InternalServerError).end());
  }

  /**
   * AltaReclamo Funcionando
   */
  async save(req: Request, res: Response): Promise<void> {
    const reclamo = req.body;
    let usuario: Usuario;
    let exceptionErr = false;
    let datosTienda = await getDatosTienda(parseInt(reclamo.nroOrden));
    if(datosTienda.message != undefined && datosTienda.message != ""){
      LogService.save(new Logs("Error",`Error en save. No se pudo obtener los datos de la orden ${reclamo.nroOrden} en la tienda. ${datosTienda.message}`)); 
      res.status(ResponseCode.InternalServerError).json({"message": `Error al obtener datos de la orden ${reclamo.nroOrden} en la tienda. ${datosTienda.message}`});
      return;
    } 
    if(reclamo.mail == undefined || reclamo.mail == ""){
      res.status(ResponseCode.InternalServerError).json({
          message: `No se a podido dar de alta el usuario. Parametros erroneos`
      });
      LogService.save(new Logs("Error",`Error en save. Falta parametro {mail}.`)); 
      return;
    }
    else if(datosTienda.nombre == undefined || datosTienda.nombre == ""){
      res.status(ResponseCode.InternalServerError).json({
        message: `No se a podido dar de alta el usuario. Falta el nombre en la informacion de tienda`
      });
      LogService.save(new Logs("Error",`Error en save. Falta parametro {name}.`)); 
      return;
    }
    else{
      if(reclamo.mail != datosTienda.logistica.email){
        LogService.save(new Logs("Error",`Error en save. El email enviado no coincide con el email de tienda ${reclamo.mail} - ${datosTienda.logistica.email}.`)); 
        res.status(ResponseCode.InternalServerError).json({
          message: `El email enviado no coincide con el email de tienda ${reclamo.mail} - ${datosTienda.logistica.email}`
        });
        return;
      }
      usuario = await UsuarioService.findOne(reclamo.mail)
      .catch(err => {
        LogService.save(new Logs("Error",`Error en save. Error en la busqueda de usuario ${reclamo.mail} - ${err}.`)); 
          res.status(ResponseCode.InternalServerError).json({
          message: `Falla en la busqueda del usuario ${reclamo.mail}`,
          error: `${err}`
        });
        exceptionErr = true;
        return null;
      });
      if(exceptionErr)
        return;
    }
    if(!usuario){
      let direccion = reclamo.calle + ", " + 
      reclamo.codPostal + ", " +
      reclamo.ciudad + ", " +
      reclamo.provincia

      usuario = new Usuario(0,datosTienda.nombre,reclamo.mail,"",direccion,"usuario");
      UsuarioService.save(usuario);
    }
    if(reclamo.descripcion == undefined || reclamo.nroOrden == undefined || reclamo.descripcion == "" || reclamo.nroOrden == ""){
      res.status(ResponseCode.InternalServerError).json({
        message: `No se puede dar de alta el reclamo. Parametros erroneos`
      });
      LogService.save(new Logs("Error",`Error en save. Faltan parametros {descripcion, nroOrden}.`)); 

      return;
    }
    setTimeout(function() {
      ReclamoService.findByNroOrden(reclamo.nroOrden)
      .then(x => {
        if(x){
          LogService.save(new Logs("Error",`Error en save. Reclamo ${reclamo.nroOrden} ya existe.`)); 

          return res.status(ResponseCode.InternalServerError).json({
            message: `El reclamo con nro de orden ` + reclamo.nroOrden + ` ya existe`
          });
        }
        else{
          let reclamoSave = new Reclamo(
            usuario,
            reclamo.descripcion,
            reclamo.nroOrden,
            'operador',
            new Date(),
            new EstadoReclamo(1, 'Ingresado')
          );
          ReclamoService.save(reclamoSave)
            .then(async x =>{ 
              let resLogistica = await doPostLogistica(datosTienda.logistica);
              if(resLogistica == 200){
                x.estado.id = 2;
                x.estado.descripcion = "Retiro Pendiente";
                ReclamoService.update(x.id, x).then(r2 => {
                  if (!r2){
                    LogService.save(new Logs("Error",`Error en save. Fallo en la actualizacion de la orden desp del post a logistica.`)); 
                    x.estado.id = 1;
                    x.estado.descripcion = "Ingresado";                    
                  }
                  res.json(x);
                })
                .catch(err2 => {
                  LogService.save(new Logs("Error",`Error en save. Fatal error en la actualizacion de la orden desp del post a logistica. ${err2}`)); 
                  x.estado.id = 1;
                  x.estado.descripcion = "Ingresado"; 
                  res.json(x);
                });
              }
              else{
                LogService.save(new Logs("Error",`Error en save. Error durante el post a logistica. ${resLogistica}`)); 
                res.json(x);
              }
            })
            .catch(err => {
              console.error(err);
              LogService.save(new Logs("Error",`Error en save. No se pudo guardar el reclamo ${err}.`)); 

              return res.status(ResponseCode.InternalServerError).json({
                message: `No se ha podido guardar el reclamo`,
                error: `${err}`
              });
            });                      
        }
      })
      .catch(err => {
        console.error(err);
        LogService.save(new Logs("Error",`Error en save. No se pudo recuperar el reclamo ${err}.`)); 

        return res.status(ResponseCode.InternalServerError).json({
          message: `Hubo un error en la recuperacion del reclamo`
        });
      });
    }, 1000);
  }

      /**
   * AltaReclamo Funcionando
   */
  async saveTienda(req: Request, res: Response): Promise<void> {
    const reclamo = req.body;
    let usuario: Usuario;
    let exceptionErr = false;
    let datosTienda = await getDatosTienda(parseInt(reclamo.orderId));
    if(datosTienda.message != undefined && datosTienda.message != ""){
      LogService.save(new Logs("Error",`Error en save. No se pudo obtener los datos de la orden ${reclamo.nroOrden} en la tienda. ${datosTienda.message}`)); 
      res.status(ResponseCode.InternalServerError).json({"message": `Error al obtener datos de la orden ${reclamo.nroOrden} en la tienda. ${datosTienda.message}`});
      return;
    } 
    if(reclamo.email == undefined || reclamo.email == ""){
      res.status(ResponseCode.InternalServerError).json({
          message: `No se a podido dar de alta el usuario. Parametros erroneos`
      });
      LogService.save(new Logs("Error",`Error en save. Falta parametro {email}.`)); 
      return;
    }
    else if(datosTienda.nombre == undefined || datosTienda.nombre == ""){
      res.status(ResponseCode.InternalServerError).json({
        message: `No se a podido dar de alta el usuario. Falta el nombre en la informacion de tienda`
      });
      LogService.save(new Logs("Error",`Error en save. Falta parametro {name}.`)); 
      return;
    }
    else{
      if(reclamo.email != datosTienda.logistica.email){
        LogService.save(new Logs("Error",`Error en save. El email enviado no coincide con el email de tienda ${reclamo.email} - ${datosTienda.logistica.email}.`)); 
        res.status(ResponseCode.InternalServerError).json({
          message: `El email enviado no coincide con el email de tienda ${reclamo.email} - ${datosTienda.logistica.email}`
        });
        return;
      }
      usuario = await UsuarioService.findOne(reclamo.email)
      .catch(err => {
        LogService.save(new Logs("Error",`Error en save. Error en la busqueda de usuario ${reclamo.email} - ${err}.`)); 
          res.status(ResponseCode.InternalServerError).json({
          message: `Falla en la busqueda del usuario ${reclamo.email}`,
          error: `${err}`
        });
        exceptionErr = true;
        return null;
      });
      if(exceptionErr)
        return;
    }
    if(!usuario){
      let direccion = datosTienda.logistica.address.street + ", " + 
      datosTienda.logistica.address.zipCode + ", " +
      datosTienda.logistica.address.city + ", " +
      datosTienda.logistica.address.state
      
      usuario = new Usuario(0,datosTienda.nombre,reclamo.email,"",direccion,"usuario");
      UsuarioService.save(usuario);
    }
    if(reclamo.description == undefined || reclamo.orderId == undefined || reclamo.description == "" || reclamo.orderId == ""){
      res.status(ResponseCode.InternalServerError).json({
        message: `No se a podido dar de alta el reclamo. Parametros erroneos`
      });
      LogService.save(new Logs("Error",`Error en saveTienda. Faltan parametros {description, orderId}.`)); 

      return;
    }
    setTimeout(function() {
      ReclamoService.findByNroOrden(reclamo.orderId)
      .then(x => {
        if(x){
          LogService.save(new Logs("Error",`Error en saveTienda. Reclamo ${reclamo.orderId} ya existe.`)); 

          return res.status(ResponseCode.InternalServerError).json({
            message: `El reclamo con nro de orden ` + reclamo.orderId + ` ya existe`
          });
        }
        else{
          let reclamoSave = new Reclamo(
            usuario,
            reclamo.description,
            reclamo.orderId,
            'usuario',
            new Date(),
            new EstadoReclamo(1, 'Ingresado')
          );
          ReclamoService.save(reclamoSave)
            .then(async x =>{ 
              let resLogistica = await doPostLogistica(datosTienda.logistica);
              if(resLogistica == 200){
                x.estado.id = 2;
                x.estado.descripcion = "Retiro Pendiente";
                ReclamoService.update(x.id, x).then(r2 => {
                  if (!r2){
                    LogService.save(new Logs("Error",`Error en saveTienda. Fallo en la actualizacion de la orden desp del post a logistica.`)); 
                    x.estado.id = 1;
                    x.estado.descripcion = "Ingresado";                    
                  }
                  res.json(x);
                })
                .catch(err2 => {
                  LogService.save(new Logs("Error",`Error en saveTienda. Fatal error en la actualizacion de la orden desp del post a logistica. ${err2}`)); 
                  x.estado.id = 1;
                  x.estado.descripcion = "Ingresado"; 
                  res.json(x);
                });
              }
              else{
                LogService.save(new Logs("Error",`Error en saveTienda. Error durante el post a logistica. ${resLogistica}`)); 
                res.json(x);
              }
            })
            .catch(err => {
              console.error(err);
              LogService.save(new Logs("Error",`Error en saveTienda. No se pudo guardar el reclamo ${err}.`)); 

              return res.status(ResponseCode.InternalServerError).json({
                message: `No se ha podido guardar el reclamo`,
                error: `${err}`
              });
            });
        }
      })
      .catch(err => {
        console.error(err);
        LogService.save(new Logs("Error",`Error en saveTienda. No se pudo recuperar el reclamo ${err}.`)); 

        return res.status(ResponseCode.InternalServerError).json({
          message: `Hubo un error en la recuperacion del reclamo`
        });
      });
    }, 1000);
  }

  /**
   * ModificarReclamo Funcionando
   */
  update(req: Request, res: Response): void {
    const id = parseInt(req.params.id);
    const reclamo = req.body;
    if(reclamo.estado == undefined || reclamo.descripcion == "" || reclamo.estado <=0 || reclamo.estado >=6){
      res.status(ResponseCode.InternalServerError).json({
        message: `No se pudo actualizar el reclamo. Descripcion o estado incorrecto`
      });
      return;
    }
    ReclamoService.findOne(id)
      .then(r => {
        if (!r) {
          res.status(ResponseCode.NotFound).end();
        } else {
          if(reclamo.descripcion != undefined && reclamo.descripcion != "")
            r.descripcion = reclamo.descripcion;
          r.estado.id = reclamo.estado;
          if(reclamo.estado == 4){// es un estado cancelado
            //aviso a logistica de la orden cancelada
            //axios.post("endpoint de cancel",{id de pedido = id nuestro});
            //va a requerir un token de m2m o de tipo usuario.
            //En caso de que sea de tipo usuario nos tenemos que registrar
            //cuando nos logueamos nos dan un token y con eso vamos al endpoint

            /* cuenta de reclamos en logistica
            {
              "email": "reclamos@reclamosuade.com.ar",
              "fullName": "reclamos",
              "password": "1-reclamos"
            }
            */
            axios.post("https://logistica-integracion.herokuapp.com/auth/signin",{
                "email": "reclamos@reclamosuade.com.ar",
                "password": "1-reclamos"
            })
            .then(res => {
              let token = res.data.token;
              //console.log(token);
            })
          }
          ReclamoService.update(id, r).then(r2 => {
            if (!r2) {
              return res.status(ResponseCode.InternalServerError).end();
            }
            return res.status(ResponseCode.Ok).end();
          });
        }
      })
  }

  /**
   * BajaReclamo Funcionando
   */
  remove(req: Request, res: Response): void {
    const id = parseInt(req.params.id);
    ReclamoService.remove(id)
      .then(r => {
        if (!r) return res.status(ResponseCode.NotFound).end();
        res.json(r);
      })
      .catch(err => res.status(ResponseCode.InternalServerError).end());
  }

  /**
   * GetReclamos Funcionando
   */
  getAll(req: Request, res: Response): void {
    ReclamoService.getAll()
      .then(r => res.json(r))
      .catch(err => res.status(ResponseCode.InternalServerError).end());
  }

  setCronTime(req: Request, res: Response):void {
    let time:String = req.body.time;
    let updater = new UpdateStates();
    try{
      if(time == "ya"){
        LogService.save(new Logs("Info",`Ejecutando actualizador de estados manualmente`)); 
        updater.readCsv();
      }
      else{
        if (job) {
          job.stop();
        }
        job = new CronJob(time, function () {
          LogService.save(new Logs("Info",`Ejecutando actualizador de estados por cron`)); 
          updater.readCsv();
        }, null, true, "Indian/Mauritius");
      }
      return res.status(ResponseCode.Ok).end();
    }catch(err){
       res.status(ResponseCode.InternalServerError).json({
        message: `Error asignando intervalo al cron - ${err}`
      });
    }
  }

}
// * /1 * * * * *

export default new ReclamoController();
