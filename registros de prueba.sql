INSERT INTO reclamos.estado_reclamo 
(id,descripcion) 
values 
(1,"Ingresado"), 
(2,"Retiro Pendiente"),
(3,"Finalizado"), 
(4,"Cancelado"),
(5,"No Retirado");

INSERT INTO reclamos.usuario 
(nombre,email,idSSO,direccion,telefono,rol) 
values 
("Paula Sarasa","psarasa@uade.com",1,"calle falsa 123","47556685","usuario"),
("Ricardo Thompson","rthompson@uade.com",2,"calle falsa 223","47556686","usuario"),
("Operador 1","operador@uade.com",3,"calle falsa 433","47556687","operador");

#Modificar la funcion now() segun el motor de bd usado
#Mysql: now()
#SQL Server: getdate()
#PostgreSQL: CURRENT_DATE
INSERT INTO reclamos.reclamo 
(idEstado, idUsuario, descripcion,nroOrden,fuente,fecha)
values
(1, 1, "El producto que recibi no era el especificado",1,"usuario",now()),
(3, 2, "Tiene un detalle en la costura",2,"operador",now()),
(2, 1, "El cierre principal estaba roto",3,"usuario",now());

select * from reclamos.reclamo;
select * from reclamos.usuario;
select * from reclamos.estado_reclamo;
