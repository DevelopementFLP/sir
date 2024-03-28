import { Component, HostListener, Input, ElementRef, ViewChild } from '@angular/core';
import { Usuario } from 'src/app/52_SIR.ControlUsuarios/models/usuario.interface';
import { SessionManagerService } from '../services/session-manager.service';
import { ControlUsuariosService } from 'src/app/52_SIR.ControlUsuarios/control-usuarios.service';
import { MainMenuService } from '../services/main-menu.service';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {

  actualUser: Usuario;
  isMenuOpen = false;

  constructor(
    private sessionManagerService: SessionManagerService,
    private mainMenuService: MainMenuService
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

  toogleMenuVisibility() : void {
    const menu = document.querySelector('#menuIcon') as HTMLElement;
    if(menu) {
      const mainMenu = document.querySelector('#mainPanelMenu') as HTMLElement;
      const icon = document.querySelector('#icon') as HTMLElement;
      const mainContent = document.getElementById("mainContent");
      const menuContent = document.getElementById("menuContent");

      if(mainMenu) {
        if(icon.innerText.indexOf('menu') == 0)
          icon.innerText = 'close';
        else 
          icon.innerText = 'menu';

        if (mainMenu.style.display === 'none' || mainMenu.style.display === '')
           this.showMenu(); 
        else
          this.closeMenu();
      }
    }
  }

  private closeMenu(): void {
    this.mainMenuService.closeMenu();
    this.isMenuOpen = false;
  }

  private showMenu(): void {
    this.mainMenuService.showMenu();
    this.isMenuOpen = true;
  }


}
