import {Entity, PrimaryGeneratedColumn, Column, OneToMany, JoinColumn, OneToOne, ManyToOne} from "typeorm";
import { EstadoReclamo } from "./estadoReclamo";
import { Usuario } from "./usuario";

@Entity()
export class Reclamo {
   @PrimaryGeneratedColumn()
   id: number;
   
   @Column()
   nombre: string;

   @ManyToOne(type => EstadoReclamo, estadoReclamo => estadoReclamo.id)
   @JoinColumn({ name: 'idEstado'})
   estado: EstadoReclamo

   @Column()
   fecha: string;

   @ManyToOne(type => Usuario, idUsuario => idUsuario)
   @JoinColumn({ name: 'idUsuario'})
   usuario: Usuario

   constructor($nombre: string){
    this.nombre = $nombre;
   }
}