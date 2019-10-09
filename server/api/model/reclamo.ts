import {Entity, PrimaryGeneratedColumn, Column, OneToMany, JoinColumn, OneToOne, ManyToOne} from "typeorm";
import { EstadoReclamo } from "./estadoReclamo";
import { Usuario } from "./usuario";

@Entity()
export class Reclamo {
   @PrimaryGeneratedColumn()
   private id: number;
  
   @Column()
   private fecha: Date;

   @ManyToOne(type => Usuario, idUsuario => idUsuario)
   @JoinColumn({ name: 'idUsuario'})
   private usuario: Usuario

   @Column()
   private descripcion: string;

   @Column()
   private nroOrden: number;

   @Column()
   private fuente: string;

   @ManyToOne(type => EstadoReclamo, estadoReclamo => estadoReclamo.getId)
   @JoinColumn({ name: 'idEstado'})
   private estado: EstadoReclamo

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

   /**
    * getId
    */
   public getId() {
      return this.id
   }

   /**
    * getFecha
    */
   public getFecha() {
      return this.fecha;
   }

   /**
    * getUsuario
    */
   public getUsuario() {
      return this.usuario;
   }

   /**
    * setUsuario
    */
   public setUsuario(usuario:Usuario) {
      this.usuario = usuario;
   }

   /**
    * getDescripcion
    */
   public getDescripcion() {
      return this.descripcion;
   }

   /**
    * setDescripcion
    */
   public setDescripcion(descripcion:string) {
      this.descripcion = descripcion;
   }

      /**
    * getEstado
    */
   public getEstado() {
      return this.estado;
   }
   /**
    * setEstado
    */
   public setEstado(estado : EstadoReclamo) {
      this.estado = estado;
   }

   /**
    * getNroOrden
    */
   public getNroOrden() {
      return this.nroOrden;
   }

   /**
    * setNroOrden
    */
   public setNroOrden(nroOrden : number) {
      this.nroOrden = nroOrden;
   }

   /**
    * getFuente
    */
   public getFuente() {
      return this.fuente;
   }
   /**
    * setFuente
    */
   public setFuente(fuente : string) {
      this.fuente = fuente;
   }
}