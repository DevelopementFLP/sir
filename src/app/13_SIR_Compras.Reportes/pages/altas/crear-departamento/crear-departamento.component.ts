import { Component, OnInit } from '@angular/core';
import { Departamento } from '../../../interfaces/Departamento.interface';
import { GestionComprasServiceTsService } from 'src/app/13_SIR_Compras.Reportes/services/gestion-compras.service.ts.service';
import { lastValueFrom } from 'rxjs';

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
  departamentoCrear!: Departamento;
  mostrarPopUp: boolean = false;
  
  ngOnInit(): void {

    this.iniciar();
    
  }

  constructor (private comprasService: GestionComprasServiceTsService) {}


  async iniciar(){
   await this.getListaDeDepartamentos();
  }
  async getListaDeDepartamentos(): Promise<void> {
    try {
      this.departamentoExistente = await lastValueFrom(this.comprasService.getListaDeDepartamentosAsync());
    } catch(error) {
      console.error(error)
    }
  }

  async crearDepartamentoInsert(departamento:Departamento): Promise<void> {
    try {
      await lastValueFrom(this.comprasService.crearDepartamento(departamento));
    } catch (error) {
      console.error(error);
      
    }
  }

  // async borrarFilaDelete(id: number): Promise<void> {
  //   try {
  //     await lastValueFrom(this.comprasService.EliminarD(id));
  //   } catch (error) {
  //     console.error(error);
  //   }
  // }

  async crearDepartamento(){
   
    if(this.validarDatos() == false){
      return;
    }

    if(this.existeDepartamento() == true){
      return;
    }else{


      //  Inserto valor en bd

      this.departamentoCrear = {
        idDepartamento: 0,
        codigo: this.codigoDepartamento,
        nombre: this.nombreDepartamento
      }
      this.mostrarPopUp = false; 
      this.nombreDepartamento = "";
      this.codigoDepartamento ="";

      await this.crearDepartamentoInsert(this.departamentoCrear);
      await this.iniciar();


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

  mostrarPopUpDepartamento(){
    this.mostrarPopUp = true;
  }
  cerrarPopUpDepartamento(){
    this.mostrarPopUp = false;
  }

  // async borrarFila(id: number){

  //   await this.borrarFilaDelete(id);
    
  //   await this.iniciar();

  // }
}
