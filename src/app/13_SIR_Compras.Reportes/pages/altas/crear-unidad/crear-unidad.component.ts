import { Component, OnInit } from '@angular/core';
import { Unidad } from '../../../interfaces/Unidad.interface';
import { GestionComprasServiceTsService } from 'src/app/13_SIR_Compras.Reportes/services/gestion-compras.service.ts.service';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-crear-unidad',
  templateUrl: './crear-unidad.component.html',
  styleUrls: ['../../../css/estilos.css','./crear-unidad.component.css']
})
export class CrearUnidadComponent implements OnInit{
  
  codigo: string = "";
  nombre: string = "";
  unidadExiste: Unidad[] =[];
  unidadCrear!: Unidad;
  mostrarPopUp: boolean = false;
  filaSeleccionada: any = null; // Almacena La fila seleccionada
  estaEditando: boolean = false;

  async ngOnInit(): Promise<void> {
    
    await this.iniciar();
  }


  constructor (private comprasService: GestionComprasServiceTsService) {}


  async iniciar(){
   await this.getListaDeUnidades();
  }

  async getListaDeUnidades(): Promise<void> {
    try {
      this.unidadExiste = await lastValueFrom(this.comprasService.getListaDeUnidadProductoAsync());
    } catch(error) {
      console.error(error)
    }
  }

  async crearUnidadInsert(unidad: Unidad): Promise<void> {
    try {
      await lastValueFrom(this.comprasService.crearUnidadProducto(unidad));
    } catch (error) {
      console.error(error);
      
    }
  }
  async editarUnidad(unidad: Unidad): Promise<void> {
    try {
      await lastValueFrom(this.comprasService.editarUnidadProducto(unidad));
    } catch (error) {
      console.error(error);
      
    }
  }

  async borrarFilaDelete(id: number): Promise<void> {
    try {
      await lastValueFrom(this.comprasService.eliminarUnidadProducto(id));
    } catch (error) {
      console.error(error);
    }
  }

  
  async crearUnidad(){

    if(this.validarDatos() == false)
      return;


    if(this.estaEditando == true){

      this.unidadCrear = {
        idUnidad: this.filaSeleccionada.idUnidad,
        codigo: this.codigo,
        nombre: this.nombre
      }
      await this.editarUnidad(this.unidadCrear);
    } else{

    


    if(this.existeUnidad() == true)
      return;

    this.unidadCrear = {
      idUnidad: 0,
      codigo: this.codigo,
      nombre: this.nombre
    }


    await this.crearUnidadInsert(this.unidadCrear);
  }
    await this.iniciar();
    this.nombre = "";
    this.codigo = "";
    this.mostrarPopUp = false;
    this.estaEditando = false;
    this.filaSeleccionada = null;

  }

  validarDatos(): boolean{
    if(this.nombre == ""){
      alert("Ingrese el nombre de la unidad");
      return false;
    }

    if(this.codigo == ""){
      alert("Ingrese el código de la unidad");
      return false;
    }
    return true;
  }

  existeUnidad(): boolean{
    let existe: boolean = false;
    
    // Verifico si existe la empresa, primero lo paso todo a minuscula por si existe pero con mayuscula o al revés
    if(this.unidadExiste.find(e => e.nombre.toLocaleLowerCase() == this.nombre.toLocaleLowerCase())){
      existe = true;
      alert("El nombre de la unidad ingresado ya existe");
      return true;
    }
    if(this.unidadExiste.find(e => e.codigo == this.codigo)){
      existe = true;
      alert("El código de la unidad ingresado ya existe");
      return true;
    }
    return false;
  }

  mostrarPopUpUnidad(){
    this.mostrarPopUp = true;
  }
  cerrarPopUpUnidad(){
    this.mostrarPopUp = false;
    this.estaEditando = false;
    this.nombre = "";
    this.codigo = "";
  }
  
  
  seleccionarFila(event: any): void {
    this.filaSeleccionada = event.data; // Guarda el objeto seleccionado
  }
  
  desSeleccionarFila(event: any): void {
    this.filaSeleccionada = null; // Limpia la selección
  }
  async borrarFila(){

    const confirmaEliminar = await this.comprasService.mostrarConfirmacion('¿Seguro que desea eliminar la unidad?','No podrás revertir esta acción','warning',true,'Sí, Eliminar','Cancelar');
    // Si da cancelar sale de la función, de lo contrario sigue el código
    if(!confirmaEliminar)
      return;
    await this.borrarFilaDelete(this.filaSeleccionada.idUnidad);
    await this.iniciar();
    this.filaSeleccionada = null;

  }


  editarFila(){
    console.log(this.filaSeleccionada);
    this.estaEditando = true;
    this.nombre = this.filaSeleccionada.nombre;
    this.codigo = this.filaSeleccionada.codigo
    this.mostrarPopUp = true;
  }

}
