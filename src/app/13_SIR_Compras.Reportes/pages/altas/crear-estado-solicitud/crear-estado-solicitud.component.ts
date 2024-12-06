import { Component, OnInit } from '@angular/core';
import { EstadoDeSolicitud } from 'src/app/13_SIR_Compras.Reportes/interfaces/EstadoDeSolicitud.interface';

@Component({
  selector: 'app-crear-estado-solicitud',
  templateUrl: './crear-estado-solicitud.component.html',
  styleUrls: ['../../../css/estilos.css','./crear-estado-solicitud.component.css']
})
export class CrearEstadoSolicitudComponent implements OnInit{
  
  nombre!:string;
  estadoExistente: EstadoDeSolicitud[] = [];
  estadoCrear: EstadoDeSolicitud[] = [];
  
  ngOnInit(): void {

    // Cargo los estados de solicitud existentes
   
    this.estadoExistente.push({
      idEstado: 0,
      nombre: 'Completo'
    })
   
    this.estadoExistente.push({
      idEstado: 2,
      nombre: 'En Progreso'
    })
  }



  crearEstadoSolicitud(){

    if(this.nombre == "" || this.nombre == undefined){
      alert("Ingrese el nombre del estado de solicitud");
      return;
    }
    
    if(this.estadoExiste() == true){
      return;
    }

    this.estadoCrear.push({
      idEstado: 0,
      nombre: this.nombre
    })

    console.log(this.estadoCrear);


  }

  estadoExiste(): boolean{

    let existe: boolean = false;
    
    // Verifico si existe la empresa, primero lo paso todo a minuscula por si existe pero con mayuscula o al revés
    if(this.estadoExistente.find(e => e.nombre.toLocaleLowerCase() == this.nombre.toLocaleLowerCase())){
      existe = true;
      alert("El estado ingresado ya existe");
      return true;
    }
    
    return false;

  }

}


