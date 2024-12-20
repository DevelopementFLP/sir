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
 
  async ngOnInit(): Promise<void> {

    await this.iniciar();
    console.log(this.rolesExistentes);
    
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

  
  // async borrarFilaDelete(id: number): Promise<void> {
  //   try {
  //     await lastValueFrom(this.comprasService.eliminarrol(id));
  //   } catch (error) {
  //     console.error(error);
  //   }
  // }


  mostrarPopUpRol(){
    this.mostrarPopUp = true;
  }
  
  cerrarPopUpRol(){
    this.mostrarPopUp = false;
  }

  async crearRol(){
    if(this.nombre == ""){
      alert("Ingrese el nombre del Rol a crear");
      return;
    }

    // Verificar en la bd si ese nombre existe ya
    if(this.existeRol() == true){
      alert("Ese Rol ya existe con ese nombre");
      return;
    }else{

      // Creo la empresa

      this.rolCrear = {
        idRol: 0,
        nombre: this.nombre
      }

      await this.crearRolInsert(this.rolCrear);
      await this.iniciar();
      this.nombre="";
      this.mostrarPopUp = false;      
    }

  }

  async iniciar(){
    await this.GetListaDeRoles();
 }

 existeRol(): boolean{
   let existe: boolean = false;
   
   // Verifico si existe la empresa, primero lo paso todo a minuscula por si existe pero con mayuscula o al revés
   if(this.rolesExistentes.find(e => e.nombre.toLowerCase() == this.nombre.toLowerCase())){
     existe = true;
   }

   return existe;

 }
}
