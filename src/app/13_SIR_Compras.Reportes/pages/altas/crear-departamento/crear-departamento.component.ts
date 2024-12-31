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
  filaSeleccionada: any = null; // Almacena La fila seleccionada
  estaEditando: boolean = false;
  
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
  async editarDepartamento(departamento:Departamento): Promise<void> {
    try {
      await lastValueFrom(this.comprasService.editarDepartamento(departamento));
    } catch (error) {
      console.error(error);
      
    }
  }

  async borrarDepartamento(id: number): Promise<void> {
    try {
      await lastValueFrom(this.comprasService.eliminarDepartamento(id));
    } catch (error) {
      console.error(error);
    }
  }

  async crearDepartamento(){
   
    if(this.validarDatos() == false){
      return;
    }

    
    
    if(this.estaEditando == true){
      
      this.departamentoCrear = {
        idDepartamento: this.filaSeleccionada.idDepartamento,
        codigo: this.codigoDepartamento,
        nombre: this.nombreDepartamento
      }
      await this.editarDepartamento(this.departamentoCrear);
    }else{
      
      if(this.existeDepartamento() == true){
        return;

      }else{
      

      //  Inserto valor en bd

      this.departamentoCrear = {
        idDepartamento: 0,
        codigo: this.codigoDepartamento,
        nombre: this.nombreDepartamento
      }
      
      await this.crearDepartamentoInsert(this.departamentoCrear);
      
    }
  }

    await this.iniciar();
    this.mostrarPopUp = false; 
    this.nombreDepartamento = "";
    this.codigoDepartamento ="";
    this.estaEditando = false;
    this.filaSeleccionada = null;


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
    this.estaEditando = false;
    this.nombreDepartamento ="";
    this.codigoDepartamento = "";
  }

  // async borrarFila(id: number){

  //   await this.borrarFilaDelete(id);
    
  //   await this.iniciar();

  // }

  seleccionarFila(event: any): void {
    this.filaSeleccionada = event.data; // Guarda el objeto seleccionado
  }
  
  desSeleccionarFila(event: any): void {
    this.filaSeleccionada = null; // Limpia la selección
  }

  async borrarFila(){

    const confirmaEliminar = await this.comprasService.mostrarConfirmacion('¿Seguro que desea eliminar el Departamento?','No podrás revertir esta acción','warning',true,'Sí, Eliminar','Cancelar');
    // Si da cancelar sale de la función, de lo contrario sigue el código
    if(!confirmaEliminar)
      return;
    await this.borrarDepartamento(this.filaSeleccionada.idDepartamento);
    await this.iniciar();
    this.filaSeleccionada = null;

  }

  editarFila(){
    this.estaEditando = true;
    this.nombreDepartamento = this.filaSeleccionada.nombre;
    this.codigoDepartamento = this.filaSeleccionada.codigo;
    this.mostrarPopUp = true;
  }
}
