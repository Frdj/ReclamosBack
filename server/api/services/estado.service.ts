import { getCustomRepository } from 'typeorm'; 
import { EstadoRepository } from '../repositories/estado.repository';
import { EstadoReclamo } from '../model/estadoReclamo';

export class EstadoService {
    save(estado: EstadoReclamo) : Promise<EstadoReclamo>{
        return getCustomRepository(EstadoRepository).save(estado);
    } 

    update(id : number , estado : any) : Promise<EstadoReclamo>{
        return getCustomRepository(EstadoRepository).update(id, estado);
    }

    remove(id: number) : Promise<EstadoReclamo>{
        return getCustomRepository(EstadoRepository).remove(id);
    }

    findOne(id: number) : Promise<EstadoReclamo> {
        return getCustomRepository(EstadoRepository).findOne(id);
    }

    getAll() : Promise<Array<EstadoReclamo>> {
        return getCustomRepository(EstadoRepository).findAll();
    } 
} 

export default new EstadoService();