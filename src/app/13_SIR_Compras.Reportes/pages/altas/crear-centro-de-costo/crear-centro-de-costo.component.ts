import { Component, OnInit } from '@angular/core';
import { Empresa } from '../../../interfaces/Empresa.interface';
import { CentroDeCosto } from '../../../interfaces/CentroDeCosto.interface';

@Component({
  selector: 'app-crear-centro-de-costo',
  templateUrl: './crear-centro-de-costo.component.html',
  styleUrls: ['../../../css/estilos.css','./crear-centro-de-costo.component.css']
})
export class CrearCentroDeCostoComponent implements OnInit{
 
  idCentroDeCosto: number = 0;
  idEmpresa!: number;
  codigo!: number;
  codigoAlernativo: string = "";
  nombre: string = "";
  empresas: Empresa[] = [];
  centroExistente: CentroDeCosto[] = [];
  centroCrear: CentroDeCosto[] = [];
 
  ngOnInit(): void {

    this.empresas.push({
      idEmpresa: 1,
      nombre: 'Empresa 1'
    })
    this.empresas.push({
      idEmpresa: 2,
      nombre: 'Empresa 2'
    })
    this.empresas.push({
      idEmpresa: 3,
      nombre: 'Empresa 3'
    })
    this.empresas.push({
      idEmpresa: 4,
      nombre: 'Empresa 4'
    })

    this.centroExistente.push({
      idCentroDeCosto: 0,
      idEmpresa: 0,
      codigo: 1,
      codigoAlternativo: '2',
      nombre: 'prueba'
    })
    this.centroExistente.push({
      idCentroDeCosto: 0,
      idEmpresa: 0,
      codigo: 2,
      codigoAlternativo: '3',
      nombre: 'prueba2'
    })
  }

  crearCentroDeCosto(){

    if(this.validarDatos()==false)
      return;

    if(this.existeCentro()==true)
      return;
   
    console.log("Ingreso datos");

    this.centroCrear = [];
    this.centroCrear.push({
      idCentroDeCosto: 0,
      idEmpresa: this.idEmpresa,
      codigo: this.codigo,
      codigoAlternativo: this.codigoAlernativo,
      nombre: this.nombre
    })

    console.log(this.centroCrear);


  }


  validarDatos():boolean{

    if(this.nombre == ""){
      alert("Ingrese el nombre del centro");
      return false;
    }
    if(this.idEmpresa == null){
      alert("Ingrese la empresa del centro");
      return false;
    }
    if(this.codigo == null){
      alert("Ingrese el código del centro");
      return false;
    }
    if(this.codigoAlernativo == ""){
      alert("Ingrese el código alternativo del centro");
      return false;
    }
    return true;
  }


  existeCentro(): boolean{
    let existe: boolean = false;
    
    // Verifico si existe la empresa, primero lo paso todo a minuscula por si existe pero con mayuscula o al revés
    if(this.centroExistente.find(e => e.codigo == this.codigo)){
      existe = true;
      alert("El código ingresado ya existe");
      return true;
    }
    if(this.centroExistente.find(e => e.codigoAlternativo.toLowerCase() == this.codigoAlernativo.toLowerCase())){
      existe = true;
      alert("El código alternativo ingresado ya existe");
      return true;
    }
    if(this.centroExistente.find(e => e.nombre.toLowerCase() == this.nombre.toLowerCase())){
      existe = true;
      alert("El nombre ingresado ya existe");
      return true;
    }
    

    return existe;

  }

}
