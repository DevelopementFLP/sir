import { Injectable } from '@angular/core';
import { MainMenuService } from './main-menu.service';
import { MenuItem } from 'primeng/api';
import { DataService } from './data.service';
import { SessionManagerService } from './session-manager.service';

@Injectable({providedIn: 'root'})
export class NavBarService {
    isMenuOpen = false;
    menuItems: MenuItem[] = [];

    constructor(
      private mainMenuService: MainMenuService,
      private sessionManagerService: SessionManagerService
    ) { }
    
    getSideBarMenu() {
      return this.sessionManagerService.getMenu();
    }

    transformarAMenuItems(data: any[]): MenuItem[] {
      return data.map((item) => {
        const menuItem: MenuItem = {
          label: item.label,
          icon: item.icon,
          routerLink: item.routerLink,
          items: item.items ? this.transformarAMenuItems(item.items) : undefined,
        };
  
        if (menuItem.items) {
          menuItem.items.forEach((subItem) => {
            subItem.command = () => this.handleSubMenuItemClick(subItem);
          });
        }
  
        return menuItem;
      });
    }

    setExpansionState(items: MenuItem[]): MenuItem[] {
      return items.map(item => {
        if (item.items && item.items.length > 0) {
          item.items = this.setExpansionState(item.items);
        }
        return { ...item, expanded: false }; 
      });
    }

    handleSubMenuItemClick(item: MenuItem) {
      const event = new KeyboardEvent('keydown', {
        key: 'Escape', 
        code: 'Escape',
        keyCode: 27,
      });
  
      document.dispatchEvent(event);
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