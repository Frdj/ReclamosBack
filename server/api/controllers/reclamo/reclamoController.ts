import ReclamoService from '../../services/reclamo.service';
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
        ReclamoService.findOne(id).then(r => {
            if (!r) {
                res.status(ResponseCode.NotFound).end()
            } else {
                res.json(r);
            }
        }).catch(err => res.status(ResponseCode.InternalServerError).end());
    }

    /**
     * AltaReclamo Funcionando
     */
    save(req: Request, res: Response): void {
        //const sleep = (waitTimeInMs) => new Promise(resolve => setTimeout(resolve, waitTimeInMs));
        const reclamo = req.body;

        //Con este new Reclamo lo que se evita es que si se mandan más parametros en req, no se usen.
        let reclamoSave = new Reclamo(
            new Usuario(
                reclamo.usuario.id,
                0,
                "",
                "",
                "",
                "",
                ""
            ),
            reclamo.descripcion,
            reclamo.nroOrden,
            reclamo.fuente,
            new Date(),
            new EstadoReclamo(1,"Ingresado")
        );
            /*
                $usuario:Usuario, 
                $descripcion: string, 
                $nroOrden: number, 
                $fuente:string, 
                $fecha: Date,
                $estado: EstadoReclamo
            */
        ReclamoService.save(reclamoSave).then(x => res.json(x)).catch(err => console.error(err));    
    }

    /**
     * ModificarReclamo Funcionando
     */
    update(req: Request, res: Response): void {
        const id = parseInt(req.params.id);
        const reclamo = req.body;

        let reclamoSave = new Reclamo(
            new Usuario(
                reclamo.usuario.id,
                0,
                "",
                "",
                "",
                "",
                ""
                /*reclamo.usuario.idSSO,
                reclamo.usuario.nombre,
                reclamo.usuario.email,
                reclamo.usuario.telefono,
                reclamo.usuario.direccion,
                reclamo.usuario.rol*/
            ),
            reclamo.descripcion,
            reclamo.nroOrden,
            reclamo.fuente,
            new Date(reclamo.fecha),
            new EstadoReclamo(reclamo.estado.id,"")
        );
        
        ReclamoService.update(id, reclamo).then(r => {
            if(!r) return res.status(ResponseCode.NotFound).end();
            return res.status(ResponseCode.Ok).end();
        });
    }

    /**
     * BajaReclamo Funcionando
     */
    remove(req: Request, res: Response): void {
        const id = parseInt(req.params.id);
        ReclamoService.remove(id).then(r => {
            if (!r) return res.status(ResponseCode.NotFound).end();
            res.json(r);
        }).catch(err => res.status(ResponseCode.InternalServerError).end());
    }

    /**
     * GetReclamos Funcionando
     */
    getAll(req: Request, res: Response): void {
        ReclamoService.getAll()
        .then(r=>res.json(r))
        .catch(err=>res.status(ResponseCode.InternalServerError).end());
    }

}

export default new ReclamoController();