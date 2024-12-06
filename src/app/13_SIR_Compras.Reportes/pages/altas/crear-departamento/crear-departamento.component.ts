import { Component, OnInit } from '@angular/core';
import { Departamento } from '../../../interfaces/Departamento.interface';

@Component({
  selector: 'app-crear-departamento',
  templateUrl: './crear-departamento.component.html',
  styleUrls: ['../../../css/estilos.css','./crear-departamento.component.css']
})
export class CrearDepartamentoComponent implements OnInit{
  
  idDepartamento: number = 0;
  codigoDepartamento: string = "";
  nombreDepartamento: string = "";
  departamentoExistente: Departamento[] = [];
  departamentoCrear: Departamento[] =[];
  
  ngOnInit(): void {
    

    this.departamentoExistente.push({
      idDepartamento: 0,
      codigo: '2323',
      nombre: 'codigo'
    })
    this.departamentoExistente.push({
      idDepartamento: 0,
      codigo: '11holaa',
      nombre: 'codigO1'
    })
  }


  crearDepartamento(){
   
    if(this.validarDatos() == false){
      return;
    }

    if(this.existeDepartamento() == true){
      return;
    }else{


      //  Inserto valor en bd
      this.departamentoCrear = [];
      this.departamentoCrear.push({
        idDepartamento: 0,
        codigo: this.codigoDepartamento,
        nombre: this.nombreDepartamento
      })
      console.log(this.departamentoCrear);

    }

  }

  validarDatos(): boolean{

    if(this.nombreDepartamento == ""){
      alert("Ingrese el nombre del departamento");
      return false;
    }
    if(this.codigoDepartamento ==""){
      alert("Ingrese el código del departamento");
      return false;
    }
    
    return true;

  }

  existeDepartamento(): boolean{
    let existe: boolean = false;
    
    // Verifico si existe la empresa, primero lo paso todo a minuscula por si existe pero con mayuscula o al revés
    if(this.departamentoExistente.find(e => e.codigo.toLowerCase() == this.codigoDepartamento.toLowerCase())){
      existe = true;
      alert("El código ingresado ya existe");
      return true;
    }
    if(this.departamentoExistente.find(e => e.nombre.toLowerCase() == this.nombreDepartamento.toLowerCase())){
      existe = true;
      alert("El nombre ingresado ya existe");
      return true;
    }
    

    return existe;

  }
}
