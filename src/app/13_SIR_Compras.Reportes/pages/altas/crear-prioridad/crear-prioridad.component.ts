import { Component, OnInit } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { Prioridad } from 'src/app/13_SIR_Compras.Reportes/interfaces/Prioridad.interface';
import { GestionComprasServiceTsService } from 'src/app/13_SIR_Compras.Reportes/services/gestion-compras.service.ts.service';

@Component({
  selector: 'app-crear-prioridad',
  templateUrl: './crear-prioridad.component.html',
  styleUrls: ['../../../css/estilos.css','./crear-prioridad.component.css']
})
export class CrearPrioridadComponent implements OnInit {
 

  nombre!: string;
  prioridadExistente: Prioridad[] = [];
  prioridadCrear!: Prioridad;
  mostrarPopUp: boolean = false;
  filaSeleccionada: any = null; // Almacena La fila seleccionada
  estaEditando: boolean = false;

  async ngOnInit(): Promise<void> {

    // Cargo los estados de solicitud existentes

    await this.iniciar();
    console.log(this.prioridadExistente);
  }



  constructor (private comprasService: GestionComprasServiceTsService) {}


  async iniciar(){
   await this.getListaDePrioridadesDeOrden();
  }

  async getListaDePrioridadesDeOrden(): Promise<void> {
    try {
      this.prioridadExistente = await lastValueFrom(this.comprasService.getListaDePrioridadesDeOrdenesasync());
    } catch(error) {
      console.error(error)
    }
  }

  async crearPrioridadDeOrdenInsert(prioridad: Prioridad): Promise<void> {
    try {
      await lastValueFrom(this.comprasService.crearPrioridadDeOrden(prioridad));
    } catch (error) {
      console.error(error);
      
    }
  }
  async editarPrioridadDeOrden(prioridad: Prioridad): Promise<void> {
    try {
      await lastValueFrom(this.comprasService.editarPrioridadDeOrden(prioridad));
    } catch (error) {
      console.error(error);
      
    }
  }

  async borrarFilaDelete(id: number): Promise<void> {
    try {
      await lastValueFrom(this.comprasService.eliminarPrioridadDeOrden(id));
    } catch (error) {
      console.error(error);
    }
  }

  async crearPrioridad(){


    if(this.nombre == "" || this.nombre == undefined){
      alert("Ingrese el nombre de la prioridad");
      return;
    }

    if(this.estaEditando == true){


      this.prioridadCrear = {
        idPriodidadDeOrden: this.filaSeleccionada.idPriodidadDeOrden,
        nombre: this.nombre
      }

      await this.editarPrioridadDeOrden(this.prioridadCrear);

    }else{

    

    if(this.prioridadExiste() == true){
      return;
    }

    this.prioridadCrear = {
      idPriodidadDeOrden: 0,
      nombre: this.nombre
    }

    await this.crearPrioridadDeOrdenInsert(this.prioridadCrear);
  }
    await this.iniciar();
    this.mostrarPopUp = false;
    this.nombre = "";
    this.filaSeleccionada = null;
    this.estaEditando = false;

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

  mostrarPopUpPrioridad(){
    this.mostrarPopUp = true;

  }
  cerrarPopUpPrioridad(){
    this.mostrarPopUp = false;
  }

  
  
  seleccionarFila(event: any): void {
    this.filaSeleccionada = event.data; // Guarda el objeto seleccionado
  }
  
  desSeleccionarFila(event: any): void {
    this.filaSeleccionada = null; // Limpia la selección
  }
  async borrarFila(){
    const confirmaEliminar = await this.comprasService.mostrarConfirmacion('¿Seguro que desea eliminar la prioridad?','No podrás revertir esta acción','warning',true,'Sí, Eliminar','Cancelar');
  
    // Si da cancelar sale de la función, de lo contrario sigue el código
    if(!confirmaEliminar)
      return;
    await this.borrarFilaDelete(this.filaSeleccionada.idPriodidadDeOrden);
    await this.iniciar();
    this.filaSeleccionada = null;
  }


  editarFila(){
    this.estaEditando = true;
    this.nombre = this.filaSeleccionada.nombre;
    this.mostrarPopUp = true;
  }

}
