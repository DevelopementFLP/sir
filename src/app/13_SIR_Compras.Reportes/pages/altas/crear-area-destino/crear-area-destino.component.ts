import { Component, OnInit } from '@angular/core';
import { AreaDestino } from '../../../interfaces/AreaDestinto.interface';
import { GestionComprasServiceTsService } from 'src/app/13_SIR_Compras.Reportes/services/gestion-compras.service.ts.service';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-crear-area-destino',
  templateUrl: './crear-area-destino.component.html',
  styleUrls: ['../../../css/estilos.css','./crear-area-destino.component.css']
})
export class CrearAreaDestinoComponent implements OnInit{

  nombre: string ="";
  areaExistente: AreaDestino[] = [];
  crearArea!: AreaDestino;
  filaSeleccionada: any = null; // Almacena La fila seleccionada
  estaEditando: boolean = false;
  mostrarPopUp: boolean = false;


  async ngOnInit(): Promise<void> {
  

  // Cargo area existente
   await this.iniciar();
  }


  constructor (private comprasService: GestionComprasServiceTsService) {}


  async iniciar(){
   await this.getListaAreaDeDestino();
  }

  async getListaAreaDeDestino(): Promise<void> {
    try {
      this.areaExistente = await lastValueFrom(this.comprasService.getListaDeAreaDestinosasync());
    } catch(error) {
      console.error(error)
    }
  }

  async crearAreaDeDestinoInsert(area:AreaDestino): Promise<void> {
    try {
      await lastValueFrom(this.comprasService.crearAreaDestino(area));
    } catch (error) {
      console.error(error);
      
    }
  }
  async editarAreaDeDestino(area:AreaDestino): Promise<void> {
    try {
      await lastValueFrom(this.comprasService.editarAreaDestino(area));
    } catch (error) {
      console.error(error);
      
    }
  }


  async borrarFilaDelete(id: number): Promise<void> {
    try {
      await lastValueFrom(this.comprasService.eliminarAreaDestino(id));
    } catch (error) {
      console.error(error);
    }
  }

  async crearAreaDestino(){

    if(this.nombre ==""){
      alert("Ingrese el nombre del área");
      return;
    }


    if(this.estaEditando == true){


      this.crearArea = {
        idAreaDestino: this.filaSeleccionada.idAreaDestino,
        nombre: this.nombre
      }
      await this.editarAreaDeDestino(this.crearArea);
    } else{

   

    if(this.existeArea()==true)
      return;
    
    // Inserto datos en la bd
    this.crearArea = {
      idAreaDestino: 0,
      nombre: this.nombre
    }

    await this.crearAreaDeDestinoInsert(this.crearArea);
  }
    await this.iniciar();

    this.mostrarPopUp = false;
    this.nombre = "";
    this.filaSeleccionada = null;
    this.estaEditando = false;

  }

  existeArea(): boolean{
    let existe: boolean = false;
    
    // Verifico si existe la empresa, primero lo paso todo a minuscula por si existe pero con mayuscula o al revés
    if(this.areaExistente.find(e => e.nombre == this.nombre)){
      existe = true;
      alert("El nombre del área ingresado ya existe");
      return true;
    }
    return false;
  }
  
  mostrarPopUpAreaDestino(){
    this.mostrarPopUp = true;
  }
  cerrarPopUpAreaDestino(){
    this.mostrarPopUp = false;
    this.estaEditando = false;
    this.nombre ="";

  }

  
  
  seleccionarFila(event: any): void {
    this.filaSeleccionada = event.data; // Guarda el objeto seleccionado
  }
  
  desSeleccionarFila(event: any): void {
    this.filaSeleccionada = null; // Limpia la selección
  }
  
  async borrarFila(){

    const confirmaEliminar = await this.comprasService.mostrarConfirmacion('¿Seguro que desea eliminar el área de destino?','No podrás revertir esta acción','warning',true,'Sí, Eliminar','Cancelar');
    // Si da cancelar sale de la función, de lo contrario sigue el código
    if(!confirmaEliminar)
      return;
    await this.borrarFilaDelete(this.filaSeleccionada.idAreaDestino);
    await this.iniciar();
    this.filaSeleccionada = null;

  }

  editarFila(){
    this.estaEditando = true;
    this.nombre = this.filaSeleccionada.nombre;
    this.mostrarPopUp = true;
  }

}
