import { Reclamo } from '../model/reclamo';
import { ReclamoRepository } from '../repositories/reclamo.repository';
import { getCustomRepository } from 'typeorm'; 

export class ReclamoService {
    save(reclamo: Reclamo) : Promise<Reclamo>{
        return getCustomRepository(ReclamoRepository).save(reclamo);
    } 

    update(id : number , reclamo: Reclamo) : Promise<Reclamo>{
        return getCustomRepository(ReclamoRepository).update(id, reclamo);
    }

    remove(id: number) : Promise<Reclamo>{
        return getCustomRepository(ReclamoRepository).remove(id);
    }

    findOne(id: number) : Promise<Reclamo> {
        return getCustomRepository(ReclamoRepository).findOne(id);
    }

    findOneByOrden(id: number) : Promise<Reclamo[]> {
        return getCustomRepository(ReclamoRepository).findOneByOrden(id);
    }

    getAll() : Promise<Array<Reclamo>> {
        return getCustomRepository(ReclamoRepository).findAll();
    } 

    findByNroOrden(nroOrden: number) : Promise<Reclamo> {
        return getCustomRepository(ReclamoRepository).findByNroOrden(nroOrden);
    }
} 

export default new ReclamoService();
