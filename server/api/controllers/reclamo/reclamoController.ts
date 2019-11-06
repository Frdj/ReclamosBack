import ReclamoService from '../../services/reclamo.service';
import UsuarioService from '../../services/usuario.service';
import { Request, Response } from 'express';
import { Reclamo } from '../../model/reclamo';
import { ResponseCode } from '../../dtos/response-codes.enum';
import { Usuario } from '../../model/usuario';
import { EstadoReclamo } from '../../model/estadoReclamo';

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
    let usuario: Usuario = await UsuarioService.findOne(reclamo.email).catch(err => {return null;});
    if(!usuario){
      /**Futura implementacion de alta usuario*/
       res.status(ResponseCode.InternalServerError).json({
          message: `El usuario no existe`
       });
       return;
    }
    if(reclamo.descripcion == "" || reclamo.nroOrden == ""){
      res.status(ResponseCode.InternalServerError).json({
        message: `Datos insuficientes`
      });
      return;
    }

    ReclamoService.findByNroOrden(reclamo.nroOrden)
    .then(x => {
      if(x){
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
          .then(x => res.json(x))
          .catch(err => {
            console.error(err);
            return res.status(ResponseCode.InternalServerError).json({
              message: `No se ha podido guardar el reclamo`
            });
          });
      }
    })
    .catch(err => {
      console.error(err);
      return res.status(ResponseCode.InternalServerError).json({
        message: `Hubo un error en la recuperacion del reclamo`
      });
    });
  }

  /**
   * ModificarReclamo Funcionando
   */
  update(req: Request, res: Response): void {
    const id = parseInt(req.params.id);
    const reclamo = req.body;
    if(reclamo.descripcion == "" || reclamo.estado <=0 || reclamo.estado >5){
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
          r.descripcion = reclamo.descripcion;
          r.estado.id = reclamo.estado;
          ReclamoService.update(id, r).then(r2 => {
            if (!r2) return res.status(ResponseCode.InternalServerError).end();
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
}

export default new ReclamoController();
