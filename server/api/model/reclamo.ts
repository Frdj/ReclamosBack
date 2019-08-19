import {Entity, PrimaryGeneratedColumn, Column} from "typeorm";

@Entity()
export class Reclamo {
   @PrimaryGeneratedColumn()
   id: number;
   
   @Column()
   nombre: string;

   constructor($nombre: string){
    this.nombre = $nombre;
   }
}