import { Component, OnInit } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { EstadoDeSolicitud } from 'src/app/13_SIR_Compras.Reportes/interfaces/EstadoDeSolicitud.interface';
import { GestionComprasServiceTsService } from 'src/app/13_SIR_Compras.Reportes/services/gestion-compras.service.ts.service';

@Component({
  selector: 'app-crear-estado-solicitud',
  templateUrl: './crear-estado-solicitud.component.html',
  styleUrls: ['../../../css/estilos.css','./crear-estado-solicitud.component.css']
})
export class CrearEstadoSolicitudComponent implements OnInit{
  
  nombre!:string;
  color!: string;
  orden!: number;
  mostrarEnPantalla: boolean = true;
  estadoExistente: EstadoDeSolicitud[] = [];
  estadoCrear!: EstadoDeSolicitud;
  mostrarPopUp: boolean = false;
  filaSeleccionada: any = null; // Almacena La fila seleccionada
  estaEditando: boolean = false;
  
  async ngOnInit(): Promise<void> {

    // Cargo los estados de solicitud existentes

    await this.iniciar();
    console.log(this.estadoExistente);


  }



  constructor (private comprasService: GestionComprasServiceTsService) {}


  async iniciar(){
   await this.getListaDeEstadosDeSolicitud();
  }

  async getListaDeEstadosDeSolicitud(): Promise<void> {
    try {
      this.estadoExistente = await lastValueFrom(this.comprasService.getListaDeEstadoDeSolicitudesasync());
    } catch(error) {
      console.error(error)
    }
  }

  async crearEstadoDeSolicitudInsert(estado: EstadoDeSolicitud): Promise<void> {
    try {
      await lastValueFrom(this.comprasService.crearEstadoDeSolicitud(estado));
    } catch (error) {
      console.error(error);
      
    }
  }
  async editarEstadoDeSolicitud(estado: EstadoDeSolicitud): Promise<void> {
    try {
      await lastValueFrom(this.comprasService.editarEstadoDeSolicitud(estado));
    } catch (error) {
      console.error(error);
      
    }
  }

  async borrarFilaDelete(id: number): Promise<void> {
    try {
      await lastValueFrom(this.comprasService.eliminarEstadoDeSolicitud(id));
    } catch (error) {
      console.error(error);
    }
  }
  

  async crearEstadoSolicitud(){


    if(this.nombre == "" || this.nombre == undefined){
      alert("Ingrese el nombre del estado de solicitud");
      return;
    }
    

    if(this.estaEditando == true){

        this.estadoCrear = {
        idEstadoDeSolicitud: this.filaSeleccionada.idEstadoDeSolicitud,
        nombre: this.nombre,
        color: this.color,
        mostrarEnPantalla: this.mostrarEnPantalla,
        orden:0
      }

      await this.editarEstadoDeSolicitud(this.estadoCrear);


    }else{

   


    if(this.estadoExiste() == true){
      return;
    }
    this.estadoCrear = {
      idEstadoDeSolicitud: 0,
      nombre: this.nombre,
      color: this.color,
      mostrarEnPantalla: this.mostrarEnPantalla,
      orden:0
    }

    await this.crearEstadoDeSolicitudInsert(this.estadoCrear);
  }
    await this.iniciar();
    this.mostrarPopUp = false;
    this.nombre = "";
    this.filaSeleccionada = null;
    this.estaEditando = false;
    
  }

  estadoExiste(): boolean{

    let existe: boolean = false;
    
    // Verifico si existe la empresa, primero lo paso todo a minuscula por si existe pero con mayuscula o al revés
    if(this.estadoExistente.find(e => e.nombre.toLocaleLowerCase() == this.nombre.toLocaleLowerCase())){
      existe = true;
      alert("El estado ingresado ya existe");
      return true;
    }
    
    return false;

  }

  mostrarPopUpEstadoSolicitud(){
    this.mostrarPopUp = true;
  }
  cerrarPopUpEstadoSolicitud(){
    this.mostrarPopUp = false;
    this.estaEditando = false;
    this.nombre = "";
    this.color = "";


  }

  
  seleccionarFila(event: any): void {
    this.filaSeleccionada = event.data; // Guarda el objeto seleccionado
  }
  
  desSeleccionarFila(event: any): void {
    this.filaSeleccionada = null; // Limpia la selección
  }
  async borrarFila(){

    const confirmaEliminar = await this.comprasService.mostrarConfirmacion('¿Seguro que desea eliminar el estado de solicitud?','No podrás revertir esta acción','warning',true,'Sí, Eliminar','Cancelar');
    // Si da cancelar sale de la función, de lo contrario sigue el código
    if(!confirmaEliminar)
      return;

    await this.borrarFilaDelete(this.filaSeleccionada.idEstadoDeSolicitud);
    await this.iniciar();
    this.filaSeleccionada = null;
  }


  editarFila(){
    this.estaEditando = true;
    console.log(this.filaSeleccionada);
    this.nombre = this.filaSeleccionada.nombre;
    this.color = this.filaSeleccionada.color;
    this.mostrarEnPantalla = this.filaSeleccionada.mostrarEnPantalla;
    this.mostrarPopUp = true;
  }

}


