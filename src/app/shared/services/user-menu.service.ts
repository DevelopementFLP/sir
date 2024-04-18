import { Injectable } from '@angular/core';
import { SessionManagerService } from './session-manager.service';
import { IMenuItem } from '../models/menuitem.interface';
import { NavigationService } from './navigation.service';
import { Usuario } from 'src/app/52_SIR.ControlUsuarios/models/usuario.interface';


@Injectable({
  providedIn: 'root'
})
export class UserMenuService {

  constructor(
    private sessionManager: SessionManagerService,
    private navigationService: NavigationService
    ) {}

  dataMenu: IMenuItem[] = [
    {
      id: 1,
      icon:'person',
      label: 'Mis datos',
      accion:() => {
        this.goToUser();
      },
    },
    {
      id: 2,
      icon: 'settings',
      label: 'Configuración',
      accion:() => {
        
      },
    },
    {
      id: 3,
      icon: 'logout',
      label: 'Cerrar sesión',
      accion:() => {
        this.sessionManager.clearStorage('actualUser');
        this.sessionManager.clearStorage('menuItems');
        this.navigationService.navegar('');
      },
    }
  ];

  public getDataMenu() : IMenuItem[] {
    return this.dataMenu;
  } 

  private goToUser(): void {
    const dataUsuarioActual: Usuario = this.sessionManager.getStorage();

    if(dataUsuarioActual == null || dataUsuarioActual == undefined) return;
    this.navigationService.navegar('principal/usuario/' + dataUsuarioActual.nombre_usuario);
  }
}

