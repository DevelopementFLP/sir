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

    if(this.existeArea()==true)
      return;
    
    // Inserto datos en la bd
    this.crearArea = {
      idAreaDestino: 0,
      nombre: this.nombre
    }

    await this.crearAreaDeDestinoInsert(this.crearArea);
    await this.iniciar();

    this.mostrarPopUp = false;
    this.nombre = "";

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
  }

  
  async borrarFila(id: number){

    await this.borrarFilaDelete(id);
    
    await this.iniciar();

  }
}
