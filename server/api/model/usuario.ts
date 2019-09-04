import {Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany} from "typeorm";
import { Reclamo } from "./reclamo";

@Entity()
export class Usuario {
   
   @PrimaryGeneratedColumn()
   @OneToMany(type => Reclamo, reclamo => reclamo.usuario)
   id: number;
   
   @Column()
   idSSO: string;

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

   constructor($estado: string){
   //  this.estado = $estado;
   }
}