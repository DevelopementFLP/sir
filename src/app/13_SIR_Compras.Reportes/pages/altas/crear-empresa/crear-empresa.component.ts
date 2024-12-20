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

      this.empresaCrear = {
        idEmpresa: 0,
        nombre: this.nombre
      }

      await this.crearEmpresaInsert(this.empresaCrear);
      await this.iniciar();
      this.nombre="";
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
  }

  async borrarFila(id: number){

    await this.borrarFilaDelete(id);
    await this.iniciar();

  }

}
