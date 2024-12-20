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



  async crearAlmacen(){

    if(this.validarDatos()==false)
      return;

    if(this.existeAlmacen()==true)
      return;

    this.creaAlmacen = {
      idAlmacen: 0,
      nombre: this.nombre,
      descripcion: this.descripcion
    }

    await this.crearAlmacenInsert(this.creaAlmacen);
    await this.iniciar();

    this.nombre = "";
    this.descripcion = ""
    this.mostrarPopUp = false;
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
  }


  async borrarFila(id: number){

    await this.borrarFilaDelete(id);
    
    await this.iniciar();

  }
}
