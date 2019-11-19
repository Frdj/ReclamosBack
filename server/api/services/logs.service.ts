import { Logs } from '../model/logs';
import { LogsRepository } from '../repositories/logs.repository';
import { getCustomRepository } from 'typeorm'; 

export class LogsService {
    save(Logs: Logs) : Promise<Logs>{
        return getCustomRepository(LogsRepository).save(Logs);
    } 

    saveList(Logs: Array<Logs>) : Promise<Array<Logs>>{
        return getCustomRepository(LogsRepository).saveList(Logs);
    } 

    findOne(id: number) : Promise<Logs> {
        return getCustomRepository(LogsRepository).findOne(id);
    }

    getAll() : Promise<Array<Logs>> {
        return getCustomRepository(LogsRepository).findAll();
    } 
} 

export default new LogsService();
