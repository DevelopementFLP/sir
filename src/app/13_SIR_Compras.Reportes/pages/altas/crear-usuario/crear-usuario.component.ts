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
  mostrarPopUp: boolean = false;
  mostrarPopUpUsuarios: boolean = false
  filaSeleccionada: any = null; // Almacena La fila seleccionada
  estaEditando: boolean = false;
 
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
  async editarUsuario(usuario: Usuario): Promise<void> {
    try {
      await lastValueFrom(this.comprasService.editarUsuario(usuario));
    } catch (error) {
      console.error(error);
      
    }
  }
  async eliminarUsuario(idUsuario: number): Promise<void> {
    try {
      await lastValueFrom(this.comprasService.eliminarUsuario(idUsuario));
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


    if(this.estaEditando == true){
      this.usuarioCrear = {
        idUsuarioSolicitante: this.filaSeleccionada.idUsuarioSolicitante,
        idDepartamento: this.idDepartamento,
        idRol: this.idRol,
        idUsuarioSir:this.filaSeleccionada.idUsuarioSir,
        correoElectronico: this.correoElectronico
        }

        await this.editarUsuario(this.usuarioCrear);
    }else{

    

    this.usuarioCrear = {
    idUsuarioSolicitante: 0,
    idDepartamento: this.idDepartamento,
    idRol: this.idRol,
    idUsuarioSir:this.idUsuarioSir,
    correoElectronico: this.correoElectronico
    }

    await this.crearUsuarioInsert(this.usuarioCrear);
  }
    await this.iniciar();
    this.mostrarPopUp = false;
    this.nombreCompleto ="";
    this.idRol = 0;
    this.idDepartamento = 0;
    this.filaSeleccionada = null;
    this.estaEditando = false;
    
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
    this.nombreCompleto = "";
    this.correoElectronico = "";
    this.idRol = -1;
    this.idDepartamento = -1;
    this.estaEditando = false;
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


  seleccionarFila(event: any): void {
    this.filaSeleccionada = event.data; // Guarda el objeto seleccionado
  }
  
  desSeleccionarFila(event: any): void {
    this.filaSeleccionada = null; // Limpia la selección
  }
  async borrarFila(){
    
    const confirmaEliminar = await this.comprasService.mostrarConfirmacion('¿Seguro que desea eliminar el usuario?','No podrás revertir esta acción','warning',true,'Sí, Eliminar','Cancelar');
    // Si da cancelar sale de la función, de lo contrario sigue el código
    if(!confirmaEliminar)
      return;
    await this.eliminarUsuario(this.filaSeleccionada.idUsuarioSolicitante);
    await this.iniciar();
    this.filaSeleccionada = null;

  }

  editarFila(){
    this.estaEditando = true;
    // Obtengo nombre
    const nombre = this.listaUsuariosSirFiltrada.find( u => u.id_usuario == this.filaSeleccionada.idUsuarioSir) ;
    let nombreCompleto = nombre?.nombre_completo;
    this.nombreCompleto = nombreCompleto!;
    this.correoElectronico = this.filaSeleccionada.correoElectronico;
    this.idRol = this.filaSeleccionada.idRol;
    this.idDepartamento = this.filaSeleccionada.idDepartamento;
    this.mostrarPopUp = true;
  }

    
}
