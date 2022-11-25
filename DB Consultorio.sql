create table consultorio;

use consultorio;

create table doctores (
	idDoctor int primary key auto_increment,
    nombre varchar(30),
    apellido varchar(30),
    dni varchar(10),
    cuil varchar(15),
	usuario varchar(10),
    fechanacimiento date,
    numeroMatricula varchar(10),
    especialidad varchar(20),
    telefono varchar(15),
	email varchar(60),
    direccion varchar(30),
	ciudad varchar(30),
	contraseña varchar(15),
    observaciones text
);

create table pacientes (
	idPaciente int primary key auto_increment,
    nombre varchar(30),
    apellido varchar(30),
    dni varchar(10),
    cuil varchar(15),
    usuario varchar(10),
	sexo varchar(10),
    fechanacimiento date,
	edad int,
    telefono varchar(15),
	email varchar(60),
	direccion varchar(30),
    ciudad varchar(30),
    contraseña varchar(15),
    observaciones text
);

create table turnos (
	idTurno int primary key auto_increment,
    idDoctor int,
    idPaciente int,
    dni varchar(10),
    fecha date,
    horario varchar(6),
    observaciones text,
    
    foreign key (idPaciente) references pacientes(idPaciente),
    foreign key (idDoctor) references doctores(idDoctor)
);