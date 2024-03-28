import { Component } from '@angular/core';

import { UserMenuService } from '../services/user-menu.service';
import { IMenuItem } from '../models/menuitem.interface';
import { Usuario } from 'src/app/52_SIR.ControlUsuarios/models/usuario.interface';
import { SessionManagerService } from '../services/session-manager.service';



@Component({
  selector: 'app-profile-menu',
  templateUrl: './profile-menu.component.html',
  styleUrls: ['./profile-menu.component.css']
})
export class ProfileMenuComponent {

  dataMenu: IMenuItem[] = this.userMenuService.getDataMenu();
  usuarioActual: Usuario = this.sessionService.getStorage();

  constructor(
    private userMenuService: UserMenuService,
    private sessionService: SessionManagerService
  ) {}
}
