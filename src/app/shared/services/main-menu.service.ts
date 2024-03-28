import { Injectable } from '@angular/core';

@Injectable({providedIn: 'root'})
export class MainMenuService {
    constructor() { }
    
    closeMenu(): void {
        const menu = document.querySelector('#menuIcon') as HTMLElement;
        const mainMenu = document.querySelector('#mainPanelMenu') as HTMLElement;
        const icon = document.querySelector('#icon') as HTMLElement;
        const menuContent = document.querySelector('#menuContent') as HTMLElement;
        icon.innerText = 'menu';
        mainMenu.style.display = 'none';
        menu.style.left = '5px';
        menuContent.style.height = '0';
      }
    
    showMenu(): void {
        const menu = document.querySelector('#menuIcon') as HTMLElement;
        const mainMenu = document.querySelector('#mainPanelMenu') as HTMLElement;
        const icon = document.querySelector('#icon') as HTMLElement;
        const menuContent = document.querySelector('#menuContent') as HTMLElement;
        icon.innerText = 'close';
        mainMenu.style.display = 'inline';
        menu.style.left = '300px';
        menuContent.style.height = '100%';
      }

}