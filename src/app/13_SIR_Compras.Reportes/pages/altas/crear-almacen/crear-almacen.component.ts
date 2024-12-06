import { Component, OnInit } from '@angular/core';
import { Almacen } from '../../../interfaces/Almacen.interface';

@Component({
  selector: 'app-crear-almacen',
  templateUrl: './crear-almacen.component.html',
  styleUrls: ['../../../css/estilos.css','./crear-almacen.component.css']
})
export class CrearAlmacenComponent implements OnInit{

  nombre: string = "";
  descripcion: string ="";
  almacenExistente: Almacen[] = [];
  creaAlmacen: Almacen[] = [];

  ngOnInit(): void {
  
    this.almacenExistente.push({
      idAlmacen: 0,
      nombre: 'almacen1',
      descripcion: 'almacen'
    })
    this.almacenExistente.push({
      idAlmacen: 0,
      nombre: 'almacen2',
      descripcion: 'almacen'
    })
    
  }

  crearAlmacen(){

    if(this.validarDatos()==false)
      return;

    if(this.existeAlmacen()==true)
      return;

    this.creaAlmacen = [];
    this.creaAlmacen.push({
      idAlmacen: 0,
      nombre: this.nombre,
      descripcion: this.descripcion
    })

    // Inserto array en bd
    console.log(this.creaAlmacen);
  }

  validarDatos(): boolean{
    if(this.nombre == ""){
      alert("Ingrese el nombre del almacén");
      return false;
    }
    if(this.descripcion == ""){
      alert("Ingrese una descripción para el almacén");
      return false;
    }
    return true;
  }
  
  existeAlmacen(): boolean{
    let existe: boolean = false;
    
    // Verifico si existe la empresa, primero lo paso todo a minuscula por si existe pero con mayuscula o al revés
    if(this.almacenExistente.find(e => e.nombre == this.nombre)){
      existe = true;
      alert("El nombre del almacén ingresado ya existe");
      return true;
    }
    return false;
  }
}
