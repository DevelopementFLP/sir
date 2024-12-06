import { normalizePassiveListenerOptions } from '@angular/cdk/platform';
import { Component, OnInit } from '@angular/core';
import { Departamento } from 'src/app/13_SIR_Compras.Reportes/interfaces/Departamento.interface';
import { Rol } from 'src/app/13_SIR_Compras.Reportes/interfaces/Rol.interface';

@Component({
  selector: 'app-crear-usuario',
  templateUrl: './crear-usuario.component.html',
  styleUrls: ['../../../css/estilos.css','./crear-usuario.component.css']
})
export class CrearUsuarioComponent implements OnInit{
 
  idUsuario!: number;
  nombre!: string;
  apellido!: string;
  idRol!: number;
  idDepartamento!: number;
  roles: Rol[] = [];
  departamentos: Departamento[] = [];
 
  ngOnInit(): void {

    this.roles.push({
      idRol: 0,
      nombre: 'comprador'
    })
    this.roles.push({
      idRol: 1,
      nombre: 'consultor'
    })
    this.departamentos.push({
      idDepartamento: 0,
      codigo: 'man',
      nombre: 'Mantenimiento'
    })
    this.departamentos.push({
      idDepartamento: 1,
      codigo: 'ing',
      nombre: 'Ingenieria'
    })
  
  }

  crearUsuario(){

    if(this.validarDatos() == false){
      return;
    }

    console.log(this.nombre);
    console.log(this.apellido);
    console.log(this.idRol);
    console.log(this.idDepartamento);
  }

  validarDatos(): boolean{
    if(this.nombre == undefined || this.nombre ==""){
      alert("Ingrese el nombre del usuario");
      return false;
    }
    if(this.apellido == undefined){
      alert("Ingrese el apellido del usuario");
      return false;
    }
    if(this.idRol == undefined){
      alert("Ingrese el rol del usuario");
      return false;
    }
    if(this.idDepartamento == undefined){
      alert("Ingrese el departamento del usuario");
      return false;
    }

    return true;
  }

}
