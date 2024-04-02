import { Component, HostListener, Input, ElementRef, ViewChild } from '@angular/core';
import { Usuario } from 'src/app/52_SIR.ControlUsuarios/models/usuario.interface';
import { SessionManagerService } from '../services/session-manager.service';
import { ControlUsuariosService } from 'src/app/52_SIR.ControlUsuarios/control-usuarios.service';
import { MainMenuService } from '../services/main-menu.service';
import { NavBarService } from '../services/nav-bar.service';
import { NavigationService } from '../services/navigation.service';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {

  actualUser: Usuario;

  constructor(
    private sessionManagerService: SessionManagerService,
    private navbarService: NavBarService,
    private navigation: NavigationService
  ) {

    this.actualUser = this.sessionManagerService.getStorage();
  }

  getIdUsuario(usuario: Usuario) : number {
    return usuario.id_usuario;
  }
  
    getNombreUsuario(usuario: Usuario) : string {
    return usuario.nombre_completo;
  }
  
   esAdmin(usuario: Usuario) : boolean {
    return usuario.id_perfil == 1;
  }

  toogleMenuVisibility(): void {
    this.navbarService.toogleMenuVisibility();
  }

  goMain(): void {
    this.navigation.navegar('');
  }
}
