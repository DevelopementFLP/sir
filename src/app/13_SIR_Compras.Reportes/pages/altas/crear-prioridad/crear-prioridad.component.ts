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

    if(this.prioridadExiste() == true){
      return;
    }

    this.prioridadCrear = {
      idPriodidadDeOrden: 0,
      nombre: this.nombre
    }

    await this.crearPrioridadDeOrdenInsert(this.prioridadCrear);
    await this.iniciar();
    this.mostrarPopUp = false;
    this.nombre = "";

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

  async borrarFila(id: number){

    await this.borrarFilaDelete(id);
    
    await this.iniciar();

  }

}
