import { Reclamo } from '../model/reclamo';
import { promises } from 'fs';
import { EntityRepository, AbstractRepository, UpdateResult } from 'typeorm';

    @EntityRepository(Reclamo)
    export class ReclamoRepository extends AbstractRepository<Reclamo> {
    constructor(){
        super();
    }
    
    update = (id: number, reclamo: Reclamo): Promise<Reclamo> => {
        return this.findOne(id)
            .then(r => {
                if (!r) return;
                const updateEntity = {                    
                    ...r,
                }
                console.log("Id: " + id);
                console.log("Reclamo: " + JSON.stringify(reclamo))
                return this.repository.save(updateEntity);
            })
            
            /*let asd = {
                descripcion : reclamo.getDescripcion(),
                estado : reclamo.getEstado()
            }
        return this.repository.update(id,asd);*/
    }

    save = (reclamo: Reclamo): Promise<Reclamo> => {
        return this.repository.save(reclamo);
    } 

    remove = (id:number): Promise<Reclamo> => {
        return this.repository.findOne(id)
        .then(r =>{
            if(!r)return;

            return this.repository.remove(r);
        })
    }

    findOne = (id: number): Promise<Reclamo> => {
        return this.repository.findOne({where: { id: id }, relations: ["estado", "usuario"]});
    } 

    findAll = (): Promise<Array<Reclamo>> => {
        return this.repository.find({ relations: ["estado", "usuario"]});
    }
}