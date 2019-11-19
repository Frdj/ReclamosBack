import {Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany} from "typeorm";
import { Reclamo } from "./reclamo";

@Entity()
export class EstadoReclamo {
   /* 
   Reclamos
Ingresado -> se hizo el new
Retiro Pendiente -> cuando le llego a logistica, si falla el post, queda en ingresado
Finalizado -> entregado
Cancelado -> desde front de reclamos
Retirado -> cuando se retiro
   */
   @PrimaryGeneratedColumn()
   @OneToMany(type => Reclamo, reclamo => reclamo.estado)
   id: number;
   
   @Column()
   descripcion: string;

   constructor($id:number,$descripcion: string){
    this.id = $id;  
    this.descripcion = $descripcion;
   }
}
