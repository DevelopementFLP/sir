import { Injectable } from '@angular/core';
import { SessionStorageService } from 'ngx-webstorage';
import { Usuario } from 'src/app/52_SIR.ControlUsuarios/models/usuario.interface';
import { ActualUser } from '../models/actualuser.interface';
import { MenuItem } from 'primeng/api';


@Injectable({
  providedIn: 'root'
})
export class SessionManagerService {

  constructor(
    private storage: SessionStorageService,
  ) { }


  public getStorage(): ActualUser {
    return this.storage.retrieve('actualUser');
  }

  public getCurrentUser(): string | null {
    return localStorage.getItem('actualUser');
  }

  public setStorage(key: string, user: Usuario) {
    //this.storage.store(key, user);
    localStorage.setItem(key, JSON.stringify(user));
  }

  public clearStorage(key: string): void {
    //this.storage.clear(key);
    localStorage.removeItem(key);
  }

  public setMenu(key: string, menu: MenuItem[]) {
    //this.storage.store(key, menu);
    localStorage.setItem(key, JSON.stringify(menu));
  }

  // public getMenu(): MenuItem[] {
  //   //return this.storage.retrieve('menuItems');
  //   return localStorage.getItem('menuItems');
  // }

  public getMenu(): string {
    //return this.storage.retrieve('menuItems');
    return localStorage.getItem('menuItems')!;
  }

  parseUsuario(jsonString: string): Usuario {
    // Parsear el string JSON a un objeto de JavaScript
    const jsonObject = JSON.parse(jsonString);

    // Crear un objeto Usuario a partir de las propiedades del objeto JSON
    const usuario: Usuario = {
        id_usuario: jsonObject.id_usuario,
        id_perfil: jsonObject.id_perfil,
        nombre_usuario: jsonObject.nombre_usuario,
        contrasenia: jsonObject.contrasenia,
        activo: jsonObject.activo,
        nombre_completo: jsonObject.nombre_completo,
        conf_perfiles: jsonObject.conf_perfiles
    };

    return usuario;
}

}
