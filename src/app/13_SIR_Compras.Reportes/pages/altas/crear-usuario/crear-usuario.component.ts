import { normalizePassiveListenerOptions } from '@angular/cdk/platform';
import { Component, OnInit } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { Departamento } from 'src/app/13_SIR_Compras.Reportes/interfaces/Departamento.interface';
import { ListaUsuariosSir } from 'src/app/13_SIR_Compras.Reportes/interfaces/ListaUsuariosSir.interface';
import { Rol } from 'src/app/13_SIR_Compras.Reportes/interfaces/Rol.interface';
import { Usuario } from 'src/app/13_SIR_Compras.Reportes/interfaces/Usuario.interface';
import { GestionComprasServiceTsService } from 'src/app/13_SIR_Compras.Reportes/services/gestion-compras.service.ts.service';
import { SessionManagerService } from 'src/app/shared/services/session-manager.service';

@Component({
  selector: 'app-crear-usuario',
  templateUrl: './crear-usuario.component.html',
  styleUrls: ['../../../css/estilos.css','./crear-usuario.component.css']
})
export class CrearUsuarioComponent implements OnInit{
 
  idUsuario!: number;
  nombreCompleto!: string;
  idRol!: number;
  idDepartamento!: number;
  correoElectronico!: string;
  idUsuarioSir!: number;
  usuarioActualSir = this.sessionManagerService.parseUsuario((this.sessionManagerService.getCurrentUser()!))
  listaUsuariosSirFiltrada: ListaUsuariosSir[] =[];
  listaUsuariosSir: ListaUsuariosSir[] =[];
  roles: Rol[] = [];
  departamentos: Departamento[] = [];
  usuarioExistente: Usuario[] = [];
  //listaUsuariosSir: 
  usuarioCrear!: Usuario;
  mostrarPopUp: boolean = true;
  mostrarPopUpUsuarios: boolean = false
 
  async ngOnInit(): Promise<void> {

   await this.iniciar();

    // const usuarioStr: string = this.sessionManagerService.getCurrentUser()!;
    // const usuario = this.sessionManagerService.parseUsuario(usuarioStr);
  }

  constructor (
    private comprasService: GestionComprasServiceTsService,
    private sessionManagerService: SessionManagerService) {}


  async iniciar(){
   await this.getListaDeRoles();
   await this.getListaDeDepartamentos();
   await this.getListaDeUsuarios();
   await this.getListaUsuariosSir();
   
    this.listaUsuariosSirFiltrada = this.listaUsuariosSir.filter((usuarioSir) => this.usuarioExistente.some((usuarioExistente) => usuarioExistente.idUsuarioSir === usuarioSir.id_usuario))

    console.log(this.listaUsuariosSirFiltrada);
  }

  async getListaDeRoles(): Promise<void> {
    try {
      this.roles = await lastValueFrom(this.comprasService.getListaDeRolesDeUsuarioAsync());
    } catch(error) {
      console.error(error)
    }
  }
  async getListaUsuariosSir(): Promise<void> {
    try {
      this.listaUsuariosSir = await lastValueFrom(this.comprasService.getListaDeUsuariosSirAsync());
    } catch(error) {
      console.error(error)
    }
  }
  async getListaDeDepartamentos(): Promise<void> {
    try {
      this.departamentos = await lastValueFrom(this.comprasService.getListaDeDepartamentosAsync());
    } catch(error) {
      console.error(error)
    }
  }
  async getListaDeUsuarios(): Promise<void> {
    try {
      this.usuarioExistente = await lastValueFrom(this.comprasService.getListaDeUsuariosAsync());
    } catch(error) {
      console.error(error)
    }
  }

  async crearUsuarioInsert(usuario: Usuario): Promise<void> {
    try {
      await lastValueFrom(this.comprasService.crearUsuario(usuario));
    } catch (error) {
      console.error(error);
      
    }
  }


  // async borrarFilaDelete(id: number): Promise<void> {
  //   try {
  //     await lastValueFrom(this.comprasService.eliminarUsuarioSolicitante(id));
  //   } catch (error) {
  //     console.error(error);
  //   }
  // }

  async crearUsuario(){

    if(this.validarDatos() == false){
      return;
    }


    this.usuarioCrear = {
    idUsuarioSolicitante: 0,
    idDepartamento: this.idDepartamento,
    idRol: this.idRol,
    idUsuarioSir:this.idUsuarioSir,
    correoElectronico: this.correoElectronico
    }

    await this.crearUsuarioInsert(this.usuarioCrear);
    await this.iniciar();
    this.mostrarPopUp = false;
    this.nombreCompleto ="";
    this.idRol = 0;
    this.idDepartamento = 0;
    
  }

  validarDatos(): boolean{
    if(this.nombreCompleto == undefined || this.nombreCompleto ==""){
      alert("Seleccione el usuario");
      return false;
    }

    if(this.idRol == undefined){
      alert("Ingrese el rol del usuario");
      return false;
    }
    if(this.idDepartamento == undefined){
      alert("Ingrese el departamento del usuario");
      return false;
    }

    return true;
  }

  mostrarPopUpUsuario(){
    this.mostrarPopUp = true;
  }

  cerrarPopUpUsuario(){
    this.mostrarPopUp = false;
  }

  getNombreDesdeId(array: any[],id: number,nombrePropiedadId:string,nombrePropiedadNombre:string): string {
    console.log(this.comprasService.getNombreDesdeId(id, array, nombrePropiedadId, nombrePropiedadNombre));
    return this.comprasService.getNombreDesdeId(id, array, nombrePropiedadId, nombrePropiedadNombre);

  }


  // async borrarFila(id: number){

  //   await this.borrarFilaDelete(id);
    
  //   await this.iniciar();

  // }


  seleccionarUsuario(idUsuarioSir: number, nombreCompleto: string){

    this.idUsuarioSir = idUsuarioSir;
    this.nombreCompleto = nombreCompleto;
    this.mostrarPopUpUsuarios = false;
  }

    
}
