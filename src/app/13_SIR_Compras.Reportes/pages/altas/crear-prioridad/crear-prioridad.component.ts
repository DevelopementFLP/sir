import { Component, OnInit } from '@angular/core';
import { Prioridad } from 'src/app/13_SIR_Compras.Reportes/interfaces/Prioridad.interface';

@Component({
  selector: 'app-crear-prioridad',
  templateUrl: './crear-prioridad.component.html',
  styleUrls: ['../../../css/estilos.css','./crear-prioridad.component.css']
})
export class CrearPrioridadComponent implements OnInit {
 

  nombre!: string;
  prioridadExistente: Prioridad[] = [];
  ngOnInit(): void {

    // Cargar prioridad existente

    this.prioridadExistente.push({
      idPrioridad: 0,
      nombre: 'Alta'
    })
    this.prioridadExistente.push({
      idPrioridad: 2,
      nombre: 'Media'
    })
  }

  crearPrioridad(){


    if(this.nombre == "" || this.nombre == undefined){
      alert("Ingrese el nombre de la prioridad");
      return;
    }

    if(this.prioridadExiste() == true){
      return;
    }

    console.log(this.nombre);

  }

  prioridadExiste(): boolean{

    let existe: boolean = false;
    
    // Verifico si existe la empresa, primero lo paso todo a minuscula por si existe pero con mayuscula o al revés
    if(this.prioridadExistente.find(e => e.nombre.toLocaleLowerCase() == this.nombre.toLocaleLowerCase())){
      existe = true;
      alert("El nombre de la prioridad ingresado ya existe");
      return true;
    }
    
    return false;

  }

}
