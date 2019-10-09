import { Usuario } from '../model/usuario';
import { UsuarioRepository } from '../repositories/usuario.repository';
import { getCustomRepository } from 'typeorm';

export class UsuarioService {
  findOne(email: string): Promise<Usuario> {
    return getCustomRepository(UsuarioRepository).findOne(email);
  }

  getAll(): Promise<Array<Usuario>> {
    return getCustomRepository(UsuarioRepository).findAll();
  }

  save(usuario: Usuario) : Promise<Usuario>{
    
    return getCustomRepository(UsuarioRepository).save(usuario);
  } 

  /*update(id : number , player : any) : Promise<Usuario>{
      return getCustomRepository(UsuarioRepository).update(id, player);
  }*/
}

export default new UsuarioService();
