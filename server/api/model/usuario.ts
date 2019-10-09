import {Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany} from "typeorm";
import { Reclamo } from "./reclamo";

@Entity()
export class Usuario {
   
   @PrimaryGeneratedColumn()
   @OneToMany(type => Reclamo, reclamo => reclamo.getUsuario)
   id: number;
   
   @Column()
   idSSO: number;

   @Column()
   nombre: string;

   @Column()
   email: string;

   @Column()
   telefono: string;

   @Column()
   direccion: string;

   @Column()
   rol: string;

   constructor($id : number, $idSSO: number, $nombre:string, $email:string,$telefono:string,$direccion:string,$rol: string){
      this.id = $id;
      this.idSSO = $idSSO;
      this.nombre = $nombre;
      this.email = $email;
      this.telefono = $telefono;
      this.direccion = $direccion;
      this.rol = $rol;
   }
}