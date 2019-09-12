import { EntityRepository, AbstractRepository } from 'typeorm';
import { EstadoReclamo } from '../model/estadoReclamo';

    @EntityRepository(EstadoReclamo)
    export class EstadoRepository extends AbstractRepository<EstadoReclamo> {
    constructor(){
        super();
    }
    
    update = (id: number, estado: EstadoReclamo): Promise<EstadoReclamo> => {
        return this.repository.findOne(id)
            .then(r => {
                if (!r) return;
                const updateEntity = {
                    ...r,
                    ...estado,
                    id: r.id
                }
                return this.repository.save(updateEntity);
            })
    }

    save = (estado: EstadoReclamo): Promise<EstadoReclamo> => {
        return this.repository.save(estado);
    } 

    remove = (id:number): Promise<EstadoReclamo> => {
        return this.repository.findOne(id)
        .then(r =>{
            if(!r)return;

            return this.repository.remove(r);
        })
    }

    findOne = (id: number): Promise<EstadoReclamo> => {
        return this.repository.findOne(id);
    } 

    findAll = (): Promise<Array<EstadoReclamo>> => {
        return this.repository.find({order: {descripcion: 'ASC' }});
    }
}