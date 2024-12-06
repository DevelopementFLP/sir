import { Component, OnInit } from '@angular/core';
import { AreaDestino } from '../../../interfaces/AreaDestinto.interface';

@Component({
  selector: 'app-crear-area-destino',
  templateUrl: './crear-area-destino.component.html',
  styleUrls: ['../../../css/estilos.css','./crear-area-destino.component.css']
})
export class CrearAreaDestinoComponent implements OnInit{

  nombre: string ="";
  areaExistente: AreaDestino[] = [];
  crearArea: AreaDestino[] =[];


  ngOnInit(): void {
  

  // Cargo area existente
  this.areaExistente.push({
    idArea: 1,
    nombre: 'area'
  })
  this.areaExistente.push({
    idArea: 2,
    nombre: 'area2'
  })

  }

  crearAreaDestino(){

    if(this.nombre ==""){
      alert("Ingrese el nombre del área");
      return;
    }

    if(this.existeArea()==true)
      return;
    
    // Inserto datos en la bd
    this.crearArea.push({
      idArea: 0,
      nombre: this.nombre
    })

    console.log(this.crearArea);
  }

  existeArea(): boolean{
    let existe: boolean = false;
    
    // Verifico si existe la empresa, primero lo paso todo a minuscula por si existe pero con mayuscula o al revés
    if(this.areaExistente.find(e => e.nombre == this.nombre)){
      existe = true;
      alert("El nombre del área ingresado ya existe");
      return true;
    }
    return false;
  }
  
}
