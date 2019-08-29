import {Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany} from "typeorm";
import { Reclamo } from "./reclamo";

@Entity()
export class EstadoReclamo {
   
   @PrimaryGeneratedColumn()
   @OneToMany(type => Reclamo, reclamo => reclamo.estado)
   id: number;
   
   @Column()
   estado: string;

   constructor($estado: string){
    this.estado = $estado;
   }
}