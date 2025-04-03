create database dbPortaria;
use dbPortaria;
 
create table moradores(
id int auto_increment not null primary key,
nome varchar (255),
bloco varchar(1),
apartamento int,
telefone int, 
email varchar(255) unique,
status enum ('visitante', 'residente', 'proprietario'),
criado_em timestamp default current_timestamp
);
 
create table veiculos(
id int auto_increment not null primary key,
placa varchar(7),
modelo varchar(255),
cor varchar(255),
morador_id int,
box int,
criado_em timestamp default current_timestamp,
foreign key (morador_id) references moradores(id)
 
);