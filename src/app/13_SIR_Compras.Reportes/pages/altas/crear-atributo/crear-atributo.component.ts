import { Component, OnInit } from '@angular/core';
import { Atributos } from '../../../interfaces/Atributos.interface';

@Component({
  selector: 'app-crear-atributo',
  templateUrl: './crear-atributo.component.html',
  styleUrls: ['../../../css/estilos.css','./crear-atributo.component.css']
})
export class CrearAtributoComponent implements OnInit {

  idAtributo: number=0;
  codigoAtributo: string = "";
  nombreAtributo: string ="";
  atributosExistentes: Atributos[] =[];
  atributoCrear: Atributos[] =[];



  ngOnInit(): void {
   
    // Cargar el array de atributos existentes
    
    this.atributosExistentes.push({
      idAtributo: 0,
      codigoAtributo: '12',
      nombre: 'atributo'
    })
    this.atributosExistentes.push({
      idAtributo: 0,
      codigoAtributo: '13',
      nombre: 'atributo2'
    })
    this.atributosExistentes.push({
      idAtributo: 0,
      codigoAtributo: '14',
      nombre: 'atributo3'
    })
    this.atributosExistentes.push({
      idAtributo: 0,
      codigoAtributo: '15',
      nombre: 'atributo4'
    })
  }


  crearAtributo(){

    if(this.validarDatos()==false){
      return;
    }

    if(this.existeAtributo()==true){
      alert("El código del atributo ya existe, verifique");
      return;
    }else{

      // Creo el atributo
      console.log("Inserto array");
      this.atributoCrear.push({
        idAtributo: 0,
        codigoAtributo: this.codigoAtributo,
        nombre: this.nombreAtributo
      })

      // Inserto array en bd

    }

  }

  validarDatos(): boolean{

    if(this.nombreAtributo==""){
      alert("Ingrese el nombre del atributo");
      return false;
    } else if(this.codigoAtributo==""){
      alert("Ingrese el código del atributo");
      return false;
    } else{
      return true;
    }
  }

  existeAtributo(): boolean{
    let existe: boolean = false;
    
    // Verifico si existe la empresa, primero lo paso todo a minuscula por si existe pero con mayuscula o al revés
    if(this.atributosExistentes.find(e => e.codigoAtributo.toLowerCase() == this.codigoAtributo.toLowerCase())){
      existe = true;
    }

    return existe;

  }
}
