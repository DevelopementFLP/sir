import { Component, OnInit } from '@angular/core';
import { Almacen } from '../../../interfaces/Almacen.interface';
import { GestionComprasServiceTsService } from 'src/app/13_SIR_Compras.Reportes/services/gestion-compras.service.ts.service';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-crear-almacen',
  templateUrl: './crear-almacen.component.html',
  styleUrls: ['../../../css/estilos.css','./crear-almacen.component.css']
})
export class CrearAlmacenComponent implements OnInit{

  nombre: string = "";
  descripcion: string ="";
  almacenExistente: Almacen[] = [];
  creaAlmacen!: Almacen;
  mostrarPopUp: boolean = false;
  filaSeleccionada: any = null; // Almacena La fila seleccionada
  estaEditando: boolean = false;

  async ngOnInit(): Promise<void> {
  
    await this.iniciar();
    
  }

  constructor (private comprasService: GestionComprasServiceTsService) {}


  async iniciar(){
   await this.getListaDeAlmacenes();
  }

  async borrarFilaDelete(id: number): Promise<void> {
    try {
      await lastValueFrom(this.comprasService.eliminarAlmacen(id));
    } catch (error) {
      console.error(error);
    }
  }


  async getListaDeAlmacenes(): Promise<void> {
    try {
      this.almacenExistente = await lastValueFrom(this.comprasService.getListaDeAlmacenesAsync());
    } catch(error) {
      console.error(error)
    }
  }

  async crearAlmacenInsert(almacen: Almacen): Promise<void> {
    try {
      await lastValueFrom(this.comprasService.crearAlmacen(almacen));
    } catch (error) {
      console.error(error);
      
    }
  }
  async editarAlmacen(almacen: Almacen): Promise<void> {
    try {
      await lastValueFrom(this.comprasService.editarAlmacen(almacen));
    } catch (error) {
      console.error(error);
      
    }
  }



  async crearAlmacen(){

    if(this.validarDatos()==false)
      return;


if(this.estaEditando == true){
  this.creaAlmacen = {
    idAlmacen: this.filaSeleccionada.idAlmacen,
    nombre: this.nombre,
    descripcion: this.descripcion
  }

  await this.editarAlmacen(this.creaAlmacen);
} else{



    if(this.existeAlmacen()==true)
      return;

    this.creaAlmacen = {
      idAlmacen: 0,
      nombre: this.nombre,
      descripcion: this.descripcion
    }

    await this.crearAlmacenInsert(this.creaAlmacen);
  }
    await this.iniciar();

    this.nombre = "";
    this.descripcion = ""
    this.mostrarPopUp = false;
    this.estaEditando = false;
    this.filaSeleccionada = null;
  }

  validarDatos(): boolean{
    if(this.nombre == ""){
      alert("Ingrese el nombre del almacén");
      return false;
    }
    if(this.descripcion == ""){
      alert("Ingrese una descripción para el almacén");
      return false;
    }
    return true;
  }
  
  existeAlmacen(): boolean{
    let existe: boolean = false;
    
    // Verifico si existe la empresa, primero lo paso todo a minuscula por si existe pero con mayuscula o al revés
    if(this.almacenExistente.find(e => e.nombre == this.nombre)){
      existe = true;
      alert("El nombre del almacén ingresado ya existe");
      return true;
    }
    return false;
  }

  mostrarPopUpAlmacen(){
    this.mostrarPopUp = true;
  }

  cerrarPopUpAlmacen(){
    this.mostrarPopUp = false;
    this.estaEditando = false;
    this.nombre = "";
    this.descripcion = "";
  }


  
  seleccionarFila(event: any): void {
    this.filaSeleccionada = event.data; // Guarda el objeto seleccionado
  }
  
  desSeleccionarFila(event: any): void {
    this.filaSeleccionada = null; // Limpia la selección
  }
  
  async borrarFila(){

    const confirmaEliminar = await this.comprasService.mostrarConfirmacion('¿Seguro que desea eliminar el almacén?','No podrás revertir esta acción','warning',true,'Sí, Eliminar','Cancelar');
    // Si da cancelar sale de la función, de lo contrario sigue el código
    if(!confirmaEliminar)
      return;
    await this.borrarFilaDelete(this.filaSeleccionada.idAlmacen);
    this.filaSeleccionada = null;
    
    await this.iniciar();

  }

  editarFila(){
    this.estaEditando = true;
    this.nombre = this.filaSeleccionada.nombre;
    this.descripcion = this.filaSeleccionada.descripcion;
    this.mostrarPopUp = true;
  }
}
