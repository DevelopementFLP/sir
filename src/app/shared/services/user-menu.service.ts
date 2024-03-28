import { Injectable } from '@angular/core';
import { SessionManagerService } from './session-manager.service';
import { IMenuItem } from '../models/menuitem.interface';


@Injectable({
  providedIn: 'root'
})
export class UserMenuService {

  constructor(private sessionManager: SessionManagerService) {}

  dataMenu: IMenuItem[] = [
    {
      id: 1,
      icon:'person',
      label: 'Mis datos',
      accion:() => {
       
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
        window.location.reload();
      },
    }
  ];

  public getDataMenu() : IMenuItem[] {
    return this.dataMenu;
  }  
}

