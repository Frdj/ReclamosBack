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
}

export default new UsuarioService();
