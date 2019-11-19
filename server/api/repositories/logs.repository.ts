import { promises } from 'fs';
import { EntityRepository, AbstractRepository } from 'typeorm';
import { Logs } from '../model/logs';

    @EntityRepository(Logs)
    export class LogsRepository extends AbstractRepository<Logs> {
    constructor(){
        super();
    }
    
    save = (Logs: Logs): Promise<Logs> => {
        return this.repository.save(Logs);
    } 

    saveList = (Logs: Array<Logs>): Promise<Array<Logs>> => {
        return this.repository.save(Logs);
    } 

    findOne = (id: number): Promise<Logs> => {
        return this.repository.findOne({where: { id: id }});
    }

    findAll = (): Promise<Array<Logs>> => {
        return this.repository.find();
    }
}
