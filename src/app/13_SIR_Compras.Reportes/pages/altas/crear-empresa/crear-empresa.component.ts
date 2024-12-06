import { Component, OnInit } from '@angular/core';
import { Empresa } from '../../../interfaces/Empresa.interface';

@Component({
  selector: 'app-crear-empresa',
  templateUrl: './crear-empresa.component.html',
  styleUrls: ['../../../css/estilos.css','./crear-empresa.component.css']
})
export class CrearEmpresaComponent implements OnInit{
  
  nombre:string ="";
  empresasExistentes: Empresa[] = [];
  empresaCrear: Empresa[] = [];
  
  ngOnInit(): void {

    // Traer las empresas existentes (llenar array empresasExistentes)

    this.empresasExistentes.push({
      idEmpresa: 0,
      nombre: 'hola'
    })
    this.empresasExistentes.push({
      idEmpresa: 0,
      nombre: 'de marco'
    })
    this.empresasExistentes.push({
      idEmpresa: 0,
      nombre: 'Holaa'
    })
    this.empresasExistentes.push({
      idEmpresa: 0,
      nombre: 'DE MARCO'
    })
    
  }

  crearEmpresa(){
   
    if(this.nombre == ""){
      alert("Ingrese el nombre de la empresa");
      return;
    }

    // Verificar en la bd si ese nombre existe ya
    if(this.existeEmpresa() == true){
      alert("Esa empresa ya existe con ese nombre");
      return;
    }else{

      // Creo la empresa
      this.empresaCrear = [];
      this.empresaCrear = [];
      this.empresaCrear.push({
        idEmpresa: 0,
        nombre: this.nombre
      })

      // Insertar empresaCrear en la base de datos
      console.log("Creo empresa");
      
    }


  }

  existeEmpresa(): boolean{
    let existe: boolean = false;
    
    // Verifico si existe la empresa, primero lo paso todo a minuscula por si existe pero con mayuscula o al revés
    if(this.empresasExistentes.find(e => e.nombre.toLowerCase() == this.nombre.toLowerCase())){
      existe = true;
    }

    return existe;

  }


}
