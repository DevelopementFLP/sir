import { Component, OnInit } from '@angular/core';
import { Unidad } from '../../../interfaces/Unidad.interface';

@Component({
  selector: 'app-crear-unidad',
  templateUrl: './crear-unidad.component.html',
  styleUrls: ['../../../css/estilos.css','./crear-unidad.component.css']
})
export class CrearUnidadComponent implements OnInit{
  
  codigo: string = "";
  nombre: string = "";
  unidadExiste: Unidad[] =[];
  unidadCrear: Unidad[] = [];

  ngOnInit(): void {
    
    this.unidadExiste.push({
      idUnidad: 0,
      codigo: '1',
      nombre: 'kilo'
    })
    this.unidadExiste.push({
      idUnidad: 0,
      codigo: '2',
      nombre: 'litro'
    })
    this.unidadExiste.push({
      idUnidad: 0,
      codigo: '3',
      nombre: 'gramo'
    })
    this.unidadExiste.push({
      idUnidad: 0,
      codigo: '4',
      nombre: 'mili gramo'
    })
  }

  crearUnidad(){

    if(this.validarDatos() == false)
      return;

    if(this.existeUnidad() == true)
      return;

    console.log("Datos");

    this.unidadCrear = [];
    this.unidadCrear.push({
      idUnidad: 0,
      codigo: this.codigo,
      nombre: this.nombre
    })

    console.log(this.unidadCrear);

  }

  validarDatos(): boolean{
    if(this.nombre == ""){
      alert("Ingrese el nombre de la unidad");
      return false;
    }

    if(this.codigo == ""){
      alert("Ingrese el código de la unidad");
      return false;
    }
    return true;
  }

  existeUnidad(): boolean{
    let existe: boolean = false;
    
    // Verifico si existe la empresa, primero lo paso todo a minuscula por si existe pero con mayuscula o al revés
    if(this.unidadExiste.find(e => e.nombre.toLocaleLowerCase() == this.nombre.toLocaleLowerCase())){
      existe = true;
      alert("El nombre de la unidad ingresado ya existe");
      return true;
    }
    if(this.unidadExiste.find(e => e.codigo == this.codigo)){
      existe = true;
      alert("El código de la unidad ingresado ya existe");
      return true;
    }
    return false;
  }
}
