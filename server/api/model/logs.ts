import {Entity, PrimaryGeneratedColumn, Column} from "typeorm";


@Entity()
export class Logs {
   @PrimaryGeneratedColumn()
    id: number;

   @Column()
    descripcion:String;

   @Column()
    fecha: Date;

   @Column()
    status:String; 

   constructor(
    $status: String,
    $descripcion:String
   )
   {
    this.status = $status;
    this.descripcion = $descripcion;
    this.fecha = new Date();
   }
}