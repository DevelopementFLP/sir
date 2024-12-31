import { Component, OnInit } from '@angular/core';
import { Empresa } from '../../../interfaces/Empresa.interface';
import { CentroDeCosto } from '../../../interfaces/CentroDeCosto.interface';
import { GestionComprasServiceTsService } from 'src/app/13_SIR_Compras.Reportes/services/gestion-compras.service.ts.service';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-crear-centro-de-costo',
  templateUrl: './crear-centro-de-costo.component.html',
  styleUrls: ['../../../css/estilos.css','./crear-centro-de-costo.component.css']
})
export class CrearCentroDeCostoComponent implements OnInit{
 
  idCentroDeCosto: number = 0;
  idEmpresa!: number;
  codigo!: number;
  codigoAlernativo: string = "";
  nombre: string = "";
  empresas: Empresa[] = [];
  centroExistente: CentroDeCosto[] = [];
  centroCrear!: CentroDeCosto;
  mostrarPopUp: boolean = false;
  filaSeleccionada: any = null; // Almacena La fila seleccionada
  estaEditando: boolean = false;
 
  async ngOnInit(): Promise<void> {

    await this.iniciar();
    console.log(this.empresas);
  }

  async crearCentroDeCosto(){

    if(this.validarDatos()==false)
      return;


    if(this.estaEditando == true){


this.centroCrear = {
      idCentroDeCosto: this.filaSeleccionada.idCentroDeCosto,
      idEmpresa: Number(this.idEmpresa),
      codigo: this.codigo,
      codigoAlternativo: this.codigoAlernativo,
      nombre: this.nombre
    }

    await this.editarCentroDeCosto(this.centroCrear);

    }else{

    


    if(this.existeCentro()==true)
      return;
   
    console.log("Ingreso datos");


    this.centroCrear = {
      idCentroDeCosto: 0,
      idEmpresa: Number(this.idEmpresa),
      codigo: this.codigo,
      codigoAlternativo: this.codigoAlernativo,
      nombre: this.nombre
    }

    await this.crearCentroDeCostoInsert(this.centroCrear);
  }
    await this.iniciar();
    this.mostrarPopUp = false;
    this.nombre="";
    this.idEmpresa = -1;
    this.codigo = 0;
    this.codigoAlernativo = "";
    this.filaSeleccionada = null;
    this.estaEditando = false;



  }

  constructor (private comprasService: GestionComprasServiceTsService) {}


  async iniciar(){
   await this.getListaCentrosDeCostos();
   await this.getListaEmpresas();
  }
  async getListaCentrosDeCostos(): Promise<void> {
    try {
      this.centroExistente = await lastValueFrom(this.comprasService.getListaDeCentroDeCostosasync());
    } catch(error) {
      console.error(error)
    }
  }
  async getListaEmpresas(): Promise<void> {
    try {
      this.empresas = await lastValueFrom(this.comprasService.getListaDeEmpresasAsync());
    } catch(error) {
      console.error(error)
    }
  }

  async crearCentroDeCostoInsert(centro:CentroDeCosto): Promise<void> {
    try {
      await lastValueFrom(this.comprasService.crearCentroDeCosto(centro));
    } catch (error) {
      console.error(error);
      
    }
  }
  async editarCentroDeCosto(centro:CentroDeCosto): Promise<void> {
    try {
      await lastValueFrom(this.comprasService.editarCentroDeCosto(centro));
    } catch (error) {
      console.error(error);
      
    }
  }

  async borrarFilaDelete(id: number): Promise<void> {
    try {
      await lastValueFrom(this.comprasService.eliminarCentroDeCosto(id));
    } catch (error) {
      console.error(error);
    }
  }


  validarDatos():boolean{

    if(this.nombre == ""){
      alert("Ingrese el nombre del centro");
      return false;
    }
    if(this.idEmpresa == null){
      alert("Ingrese la empresa del centro");
      return false;
    }
    if(this.codigo == null){
      alert("Ingrese el código del centro");
      return false;
    }
    if(this.codigoAlernativo == ""){
      alert("Ingrese el código alternativo del centro");
      return false;
    }
    return true;
  }


  existeCentro(): boolean{
    let existe: boolean = false;
    
    // Verifico si existe la empresa, primero lo paso todo a minuscula por si existe pero con mayuscula o al revés
    if(this.centroExistente.find(e => e.codigo == this.codigo)){
      existe = true;
      alert("El código ingresado ya existe");
      return true;
    }
    if(this.centroExistente.find(e => e.codigoAlternativo.toLowerCase() == this.codigoAlernativo.toLowerCase())){
      existe = true;
      alert("El código alternativo ingresado ya existe");
      return true;
    }
    if(this.centroExistente.find(e => e.nombre.toLowerCase() == this.nombre.toLowerCase())){
      existe = true;
      alert("El nombre ingresado ya existe");
      return true;
    }
    

    return existe;

  }

  mostrarPopUpCentroCosto(){
    this.mostrarPopUp = true;
  }

  cerrarPopUpCentroCosto(){
    this.mostrarPopUp = false;
    this.estaEditando = false;
    this.nombre = "";
    this.idEmpresa = -1;
    this.codigo = 0;
    this.codigoAlernativo = "";
  }


  getNombreEmpresa(idEmpresa: number){

    const empresa = this.empresas.find(p => p.idEmpresa === idEmpresa);
    return empresa?.nombre.toString() ;
  }


  async borrarFila(){

    const confirmaEliminar = await this.comprasService.mostrarConfirmacion('¿Seguro que desea eliminar el centro de costo?','No podrás revertir esta acción','warning',true,'Sí, Eliminar','Cancelar');
    // Si da cancelar sale de la función, de lo contrario sigue el código
    if(!confirmaEliminar)
      return;
    await this.borrarFilaDelete(this.filaSeleccionada.idCentroDeCosto);
    await this.iniciar();
    this.filaSeleccionada = null;
    

  }

  editarFila(){
    this.estaEditando = true;
    this.nombre = this.filaSeleccionada.nombre;
    this.idEmpresa = this.filaSeleccionada.idEmpresa;
    this.codigo = this.filaSeleccionada.codigo;
    this.codigoAlernativo = this.filaSeleccionada.codigoAlternativo
    this.mostrarPopUp = true;
  }

  seleccionarFila(event: any): void {
    this.filaSeleccionada = event.data; // Guarda el objeto seleccionado
  }
  
  desSeleccionarFila(event: any): void {
    this.filaSeleccionada = null; // Limpia la selección
  }

  
}
