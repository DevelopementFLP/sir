import { Component, OnInit } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { Rol } from 'src/app/13_SIR_Compras.Reportes/interfaces/Rol.interface';
import { GestionComprasServiceTsService } from 'src/app/13_SIR_Compras.Reportes/services/gestion-compras.service.ts.service';

@Component({
  selector: 'app-crear-rol',
  templateUrl: './crear-rol.component.html',
  styleUrls: ['../../../css/estilos.css','./crear-rol.component.css']
})
export class CrearRolComponent implements OnInit {
 
  rolesExistentes: Rol[] = [];
  rolCrear!: Rol;
  mostrarPopUp = false;
  nombre: string ="";
  filaSeleccionada: any = null; // Almacena La fila seleccionada
  estaEditando: boolean = false;
 
  async ngOnInit(): Promise<void> {

    await this.iniciar();
    
  }
  
  constructor (private comprasService: GestionComprasServiceTsService) {}

  async GetListaDeRoles(): Promise<void> {
    try {
      this.rolesExistentes = await lastValueFrom(this.comprasService.getListaDeRolesDeUsuarioAsync());
    } catch(error) {
      console.error(error)
    }
  }

  async crearRolInsert(rol: Rol): Promise<void> {
    try {
      await lastValueFrom(this.comprasService.crearRolDeUsuario(rol));
    } catch (error) {
      console.error(error);
      
    }
  }
  async editarRol(rol: Rol): Promise<void> {
    try {
      await lastValueFrom(this.comprasService.editarRolDeUsuario(rol));
    } catch (error) {
      console.error(error);
      
    }
  }
  async eliminarRol(idRol: number): Promise<void> {
    try {
      await lastValueFrom(this.comprasService.eliminarRolDeUsuario(idRol));
    } catch (error) {
      console.error(error);
      
    }
  }



  mostrarPopUpRol(){
    this.mostrarPopUp = true;
  }
  
  cerrarPopUpRol(){
    this.mostrarPopUp = false;
    this.estaEditando = false
    this.limpiarCampos();
  }

  async crearRol(){
    if(this.nombre == ""){
      alert("Ingrese el nombre del Rol a crear");
      return;
    }

    // Verificar en la bd si ese nombre existe ya
    if(this.existeRol() == true){
      alert("Ese Rol ya existe con ese nombre");
      this.limpiarCampos();
      return;
    }else{


      if(this.estaEditando == true){

        this.rolCrear = {
          idRol: this.filaSeleccionada.idRol,
          nombre: this.nombre
        }
        await this.editarRol(this.rolCrear);


      } else{

      


      // Creo la empresa

      this.rolCrear = {
        idRol: 0,
        nombre: this.nombre
      }

      await this.crearRolInsert(this.rolCrear);
    }
      await this.iniciar();
      this.mostrarPopUp = false;
      this.limpiarCampos();
    }
    
  }
  
  limpiarCampos(){
    this.nombre="";
    this.estaEditando = false;
    this.filaSeleccionada = null;
    
  }
  async iniciar(){
    await this.GetListaDeRoles();
 }

 existeRol(): boolean{
   let existe: boolean = false;


  if(this.estaEditando == true){

    const rolEditar = this.rolesExistentes.find(e => e.nombre.toLowerCase() == this.nombre.toLowerCase())
    if(rolEditar){

      let idRolEditar = rolEditar?.idRol;
      if(idRolEditar != this.filaSeleccionada.idRol){
        existe = true;
      }else{
        existe = false;
      }
    }else{
      existe = false;
    }
      
    
  }else{
    
    // Verifico si existe la empresa, primero lo paso todo a minuscula por si existe pero con mayuscula o al revés
    if(this.rolesExistentes.find(e => e.nombre.toLowerCase() == this.nombre.toLowerCase())){
      existe = true;
    }
    
  }
  return existe;
  
 }

 seleccionarFila(event: any): void {
  this.filaSeleccionada = event.data; // Guarda el objeto seleccionado
}

desSeleccionarFila(event: any): void {
  this.filaSeleccionada = null; // Limpia la selección
}
async borrarFila(){
  
  const confirmaEliminar = await this.comprasService.mostrarConfirmacion('¿Seguro que desea eliminar el siguiente rol: '+this.filaSeleccionada.nombre+'?','No podrás revertir esta acción','warning',true,'Sí, Eliminar','Cancelar');
  // Si da cancelar sale de la función, de lo contrario sigue el código
  if(!confirmaEliminar)
    return;
  await this.eliminarRol(this.filaSeleccionada.idRol);
  await this.iniciar();
  this.filaSeleccionada = null;

}

editarFila(){
  this.estaEditando = true;
  this.nombre = this.filaSeleccionada.nombre;
  this.mostrarPopUp = true;
}

}
