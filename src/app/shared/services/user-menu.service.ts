import { Injectable } from '@angular/core';
import { SessionManagerService } from './session-manager.service';
import { IMenuItem } from '../models/menuitem.interface';
import { NavigationService } from './navigation.service';
import { Usuario } from 'src/app/52_SIR.ControlUsuarios/models/usuario.interface';

@Injectable({
  providedIn: 'root',
})
export class UserMenuService {
  constructor(
    private sessionManager: SessionManagerService,
    private navigationService: NavigationService
  ) {}

  dataMenu: IMenuItem[] = [
    {
      id: 1,
      icon: 'person',
      label: 'Mis datos',
      accion: () => {
        this.goToUser();
      },
    },
    {
      id: 2,
      icon: 'settings',
      label: 'Configuración',
      accion: () => {
        this.goToConfiguration();
      },
    },
    {
      id: 3,
      icon: 'logout',
      label: 'Cerrar sesión',
      accion: () => {
        this.sessionManager.clearStorage('actualUser');
        this.sessionManager.clearStorage('menuItems');
        this.navigationService.navegar('');
      },
    },
  ];

  public getDataMenu(): IMenuItem[] {
    return this.dataMenu;
  }

  private goToUser(): void {
    var actualUserstr = localStorage.getItem('actualUser');
    var actualUser: Usuario;
    actualUser = this.sessionManager.parseUsuario(actualUserstr!);

    if (actualUser == null || actualUser == undefined) return;
    this.navigationService.navegar(
      'principal/usuario/' + actualUser.nombre_usuario
    );
  }

  private goToConfiguration(): void {
    this.navigationService.navegar('principal/configuracion');
  }
}
