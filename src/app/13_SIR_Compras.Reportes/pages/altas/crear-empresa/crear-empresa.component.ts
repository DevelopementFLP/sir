import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Empresa } from '../../../interfaces/Empresa.interface';
import { GestionComprasServiceTsService } from 'src/app/13_SIR_Compras.Reportes/services/gestion-compras.service.ts.service';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-crear-empresa',
  templateUrl: './crear-empresa.component.html',
  styleUrls: ['../../../css/estilos.css','./crear-empresa.component.css'],
  // encapsulation: ViewEncapsulation.None
})
export class CrearEmpresaComponent implements OnInit{
  
  nombre:string ="";
  empresasExistentes: Empresa[] = [];
  empresaCrear!: Empresa;
  mostrarPopUp:boolean = false;
  filaSeleccionada: any = null; // Almacena La fila seleccionada
  estaEditando: boolean = false;
  
  async ngOnInit(): Promise<void> {

    await this.GetListaDeEmpresas();    
  }
  
  constructor (private comprasService: GestionComprasServiceTsService) {}

  async GetListaDeEmpresas(): Promise<void> {
    try {
      this.empresasExistentes = await lastValueFrom(this.comprasService.getListaDeEmpresasAsync());
    } catch(error) {
      console.error(error)
    }
  }

  async crearEmpresaInsert(empresa: Empresa): Promise<void> {
    try {
      await lastValueFrom(this.comprasService.crearEmpresa(empresa));
    } catch (error) {
      console.error(error);
      
    }
  }
  async editarEmpresaBd(empresa: Empresa): Promise<void> {
    try {
      await lastValueFrom(this.comprasService.editarEmpresa(empresa));
    } catch (error) {
      console.error(error);
      
    }
  }

  async borrarFilaDelete(id: number): Promise<void> {
    try {
      await lastValueFrom(this.comprasService.eliminarEmpresa(id));
    } catch (error) {
      console.error(error);
    }
  }
  
  
  async crearEmpresa(){
    
    if(this.nombre == ""){
      alert("Ingrese el nombre de la empresa");
      return;
    }
    
    // Verificar en la bd si ese nombre existe ya
    if(this.existeEmpresa() == true){
      alert("Esa empresa ya existe con ese nombre");
      return;
    }else{
      
      // Creo la empresa
      
      if(this.estaEditando == true){
        this.empresaCrear = {
          idEmpresa: this.filaSeleccionada.idEmpresa ,
          nombre: this.nombre
        }
        
        await this.editarEmpresaBd(this.empresaCrear);
        
      }else{
        
        
        this.empresaCrear = {
          idEmpresa: 0,
          nombre: this.nombre
        } 
        await this.crearEmpresaInsert(this.empresaCrear);
        
      }
      await this.iniciar();
      this.nombre="";
      this.estaEditando = false;
      this.filaSeleccionada = null;
      this.mostrarPopUp = false;      
    }
    
    
  }
  
  iniciar(){
    this.GetListaDeEmpresas();
  }
  
  existeEmpresa(): boolean{
    let existe: boolean = false;
    
    // Verifico si existe la empresa, primero lo paso todo a minuscula por si existe pero con mayuscula o al revés
    if(this.empresasExistentes.find(e => e.nombre.toLowerCase() == this.nombre.toLowerCase())){
      existe = true;
    }
    
    return existe;
    
  }
  
  mostrarPopUpEmpresa(){
    this.mostrarPopUp = true;
  }
  
  
  cerrarPopUpEmpresa(){
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
    
    const confirmaEliminar = await this.comprasService.mostrarConfirmacion('¿Seguro que desea eliminar la empresa?','No podrás revertir esta acción','warning',true,'Sí, Eliminar','Cancelar');
    // Si da cancelar sale de la función, de lo contrario sigue el código
    if(!confirmaEliminar)
      return;
    await this.borrarFilaDelete(this.filaSeleccionada.idEmpresa);
    await this.iniciar();
    this.filaSeleccionada = null;

  }

  editarFila(){
    this.estaEditando = true;
    this.nombre = this.filaSeleccionada.nombre;
    this.mostrarPopUp = true;
  }

}

