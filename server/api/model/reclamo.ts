import {Entity, PrimaryGeneratedColumn, Column, OneToMany, JoinColumn, OneToOne, ManyToOne} from "typeorm";
import { EstadoReclamo } from "./estadoReclamo";
import { Usuario } from "./usuario";

@Entity()
export class Reclamo {
   @PrimaryGeneratedColumn()
    id: number;
  
   @Column()
    fecha: Date;

   @ManyToOne(type => Usuario, idUsuario => idUsuario)
   @JoinColumn({ name: 'idUsuario'})
    usuario: Usuario

   @Column()
    descripcion: string;

   @Column()
    nroOrden: number;

   @Column()
    fuente: string;

   @ManyToOne(type => EstadoReclamo, estadoReclamo => estadoReclamo.id)
   @JoinColumn({ name: 'idEstado'})
    estado: EstadoReclamo

   constructor(
      $usuario:Usuario, 
      $descripcion: string, 
      $nroOrden: number, 
      $fuente:string, 
      $fecha: Date,
      $estado: EstadoReclamo
   ){
      this.usuario = $usuario;
      this.descripcion = $descripcion;
      this.nroOrden = $nroOrden;
      this.fuente = $fuente;
      this.estado = $estado;
      this.fecha = $fecha;
   }
}