import {Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany} from "typeorm";
import { Reclamo } from "./reclamo";

@Entity()
export class Usuario {
   
   @PrimaryGeneratedColumn()
   @OneToMany(type => Reclamo, reclamo => reclamo.usuario)
   id: number;
   
   @Column()
   nombre: string;

   @Column()
   email: string;

   @Column()
   idSSO: string;

   @Column()
   direccion: string;

   @Column()
   telefono: string;

   @Column()
   rol: string;

   constructor($estado: string){
   //  this.estado = $estado;
   }
}