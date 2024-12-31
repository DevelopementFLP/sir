import { Component, OnInit } from '@angular/core';
import { Atributos } from '../../../interfaces/Atributos.interface';
import { GestionComprasServiceTsService } from 'src/app/13_SIR_Compras.Reportes/services/gestion-compras.service.ts.service';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-crear-atributo',
  templateUrl: './crear-atributo.component.html',
  styleUrls: ['../../../css/estilos.css','./crear-atributo.component.css']
})
export class CrearAtributoComponent implements OnInit {

  idAtributo: number=0;
  codigoAtributo: string = "";
  nombreAtributo: string ="";
  atributosExistentes: Atributos[] =[];
  atributoCrear!: Atributos;
  mostrarPopUp: boolean = false;
  filaSeleccionada: any = null; // Almacena La fila seleccionada
  estaEditando: boolean = false;



  async ngOnInit(): Promise<void> {
   
    // Cargar el array de atributos existentes

    await this.iniciar();

  }

  constructor (private comprasService: GestionComprasServiceTsService) {}

  async getListaAtributos(): Promise<void> {
    try {
      this.atributosExistentes = await lastValueFrom(this.comprasService.getListaDeAtributossync());
    } catch(error) {
      console.error(error)
    }
  }


    async editarAtributo(atributo: Atributos): Promise<void> {
      try {
        await lastValueFrom(this.comprasService.editarAtributo(atributo));
      } catch (error) {
        console.error(error);
        
      }
    }


  async crearAtributoInsert(atributo:Atributos): Promise<void> {
    try {
      await lastValueFrom(this.comprasService.crearAtributo(atributo));
    } catch (error) {
      console.error(error);
      
    }
  }
  
  async borrarFilaDelete(id: number): Promise<void> {
    try {
      await lastValueFrom(this.comprasService.eliminarAtributo(id));
    } catch (error) {
      console.error(error);
    }
  }

  async crearAtributo(){

    if(this.validarDatos()==false){
      return;
    }
    


    if(this.estaEditando == true){
      this.atributoCrear = {
        idAtributo: this.filaSeleccionada.idAtributo,
        codigoDeAtributo: this.codigoAtributo,
        nombre: this.nombreAtributo
      }
      console.log(this.atributoCrear);

      await this.editarAtributo(this.atributoCrear);

    }else{
      
    


    if(this.existeAtributo()==true){
      console.log("#");
      alert("El código del atributo ya existe, verifique");
      return;
    }else{
      
      // Creo el atributo

      this.atributoCrear = {
        idAtributo: 0,
        codigoDeAtributo: this.codigoAtributo,
        nombre: this.nombreAtributo        
      }

      await this.crearAtributoInsert(this.atributoCrear);
    }
  }
      await this.iniciar();
      this.mostrarPopUp = false;
      this.estaEditando = false;
      this.nombreAtributo = "";
      this.codigoAtributo="";
      this.filaSeleccionada = null;


  }

  async iniciar(){
    await this.getListaAtributos();
  }
  validarDatos(): boolean{

    if(this.nombreAtributo==""){
      alert("Ingrese el nombre del atributo");
      return false;
    } else if(this.codigoAtributo==""){
      alert("Ingrese el código del atributo");
      return false;
    } else{
      return true;
    }
  }

  existeAtributo(): boolean{
    let existe: boolean = false;

    // Verifico si existe la empresa, primero lo paso todo a minuscula por si existe pero con mayuscula o al revés
    if(this.atributosExistentes.find(tr => tr.codigoDeAtributo.toLocaleLowerCase() === this.codigoAtributo.toLocaleLowerCase())){
      existe = true;
    }

    return existe;
  }
  
  mostrarPopUpAtributo(){
    this.mostrarPopUp = true;
  }

  cerrarPopUpAtributo(){
    this.mostrarPopUp = false;
    this.estaEditando = false;

    this.nombreAtributo = "";
    this.codigoAtributo ="";
  }

  
  seleccionarFila(event: any): void {
    this.filaSeleccionada = event.data; // Guarda el objeto seleccionado
  }
  
  desSeleccionarFila(event: any): void {
    this.filaSeleccionada = null; // Limpia la selección
  }
  
  async eliminarFila(){

    if(this.filaSeleccionada.idAtributo){
      const confirmaEliminar = await this.comprasService.mostrarConfirmacion('¿Seguro que desea eliminar el Atributo?','No podrás revertir esta acción','warning',true,'Sí, Eliminar','Cancelar');
      // Si da cancelar sale de la función, de lo contrario sigue el código
      if(!confirmaEliminar)
        return;

      await this.borrarFilaDelete(this.filaSeleccionada.idAtributo); 
      await this.iniciar();
      this.filaSeleccionada = null;
    }

  }



  editarFila(){
    this.estaEditando = true;
    this.nombreAtributo = this.filaSeleccionada.nombre;
    this.codigoAtributo = this.filaSeleccionada.codigoDeAtributo;
    this.mostrarPopUp = true;
  }

}
