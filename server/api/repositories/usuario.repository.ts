import { Usuario } from '../model/usuario';
import { EntityRepository, AbstractRepository } from 'typeorm';
import { rejects } from 'assert';

@EntityRepository(Usuario)
export class UsuarioRepository extends AbstractRepository<Usuario> {
  constructor() {
    super();
  }

  findOne = (email: string): Promise<Usuario> => {
    return new Promise((resolve, reject) => {
      this.repository
        .findOne({ where: { email: email } })
        .then((usuario: Usuario | undefined) => {
          if (usuario) {
            resolve(usuario);
          } else {
            reject(usuario);
          }
        });
    });
  };

  findAll = (): Promise<Array<Usuario>> => {
    return this.repository.find({ order: { id: 'ASC' } });
  };

  save = (usuario: Usuario): Promise<Usuario> => {
    return new Promise((resolve, reject) => {
       return this.repository.save(usuario);
    });
  };
}
