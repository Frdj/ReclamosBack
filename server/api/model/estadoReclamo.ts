import {Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany} from "typeorm";
import { Reclamo } from "./reclamo";

@Entity()
export class EstadoReclamo {
   
   @PrimaryGeneratedColumn()
   @OneToMany(type => Reclamo, reclamo => reclamo.getEstado)
   private id: number;
   
   @Column()
   private descripcion: string;

   constructor($id:number,$descripcion: string){
    this.id = $id;  
    this.descripcion = $descripcion;
   }

   /**
    * getId
    */
   public getId() {
      return this.id;
   }

   /**
    * setId
    */
   public setId(id:number) {
      this.id = id;
   }

   /**
    * getDescripcion
    */
   public getDescripcion() {
      return this.id;
   }

   /**
    * setDescripcion
    */
   public setDescripcion(descripcion:string) {
      this.descripcion = descripcion;
   }
}