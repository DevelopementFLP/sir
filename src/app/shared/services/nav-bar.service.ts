import { Injectable } from '@angular/core';
import { MainMenuService } from './main-menu.service';

@Injectable({providedIn: 'root'})
export class NavBarService {
    isMenuOpen = false;
    
    constructor( private mainMenuService: MainMenuService) { }
    
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