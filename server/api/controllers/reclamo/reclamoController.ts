import ReclamoService from '../../services/reclamo.service';
import { Request, Response } from 'express';
import { Reclamo } from '../../model/reclamo';
import { ResponseCode } from '../../dtos/response-codes.enum';

export class ReclamoController {

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

    save(req: Request, res: Response): void {
        const reclamo = req.body;

        //Con este new Reclamo lo que se evita es que si se mandan más parametros en req, no se usen.
        let reclamoSave = new Reclamo(reclamo.nombre);
        ReclamoService.save(reclamoSave).then(x => res.json(x)).catch(err => console.error(err));
    }

    update(req: Request, res: Response): void {
        const id = parseInt(req.params.id);
        const reclamo = req.body;
        
        ReclamoService.update(id, reclamo).then(r => {
            if(!r) return res.status(ResponseCode.NotFound).end();
            return res.status(ResponseCode.Ok).end();
        });
    }

    remove(req: Request, res: Response): void {
        const id = parseInt(req.params.id);
        ReclamoService.remove(id).then(r => {
            if (!r) return res.status(ResponseCode.NotFound).end();
            res.json(r);
        }).catch(err => res.status(ResponseCode.InternalServerError).end());
    }

    getAll(req: Request, res: Response): void {
        ReclamoService.getAll()
        .then(r=>res.json(r))
        .catch(err=>res.status(ResponseCode.InternalServerError).end());
    }

}

export default new ReclamoController();