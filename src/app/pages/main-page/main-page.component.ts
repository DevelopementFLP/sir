import { Component, ElementRef, HostListener } from '@angular/core';
import { NavigationService } from 'src/app/shared/services/navigation.service';
import { SessionManagerService } from 'src/app/shared/services/session-manager.service';

interface SideNavToogle {
  screenWidth: number;
  collapsed: boolean;
}

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css']
})
export class MainPageComponent {

  isSideNavCollapsed = false;
  screenWidth = 0;
  sidebarVisible: boolean = false;

  constructor(
    private sessionManagerService: SessionManagerService,
    private navigationService: NavigationService,
    private elementRef: ElementRef
  ) {

    if(this.sessionManagerService.getStorage() == null)
      this.navigationService.navegar('login');
  }

  onToogleSideNav(data: SideNavToogle): void {
    this.screenWidth = data.screenWidth;
    this.isSideNavCollapsed = data.collapsed;
  }

  getCurrentYear(): string {
    return new Date().getFullYear().toString();
  }

  goMain(): void {
    //this.router.navigate(['principal'])
    window.location.reload();
  }

  @HostListener('document:click', ['$event'])
  onClick(event: Event) {
    const menuContent = this.elementRef.nativeElement.querySelector('#menuIcon');

    if (menuContent && menuContent.contains(event.target))
    {
      this.sidebarVisible = true;
    }
  } 

  // @HostListener('document:keydown', ['$event']) // Escucha el evento de tecla presionada en todo el documento
  // onMenuKeyPress(event: KeyboardEvent) {
  //   const evnt = new KeyboardEvent('keydown', {
  //     key: 'ContextMenu', // Puedes cambiar esto por la tecla que desees simular
  //     code: 'ContextMenu',
  //     keyCode: 93, // Esto es opcional, pero algunos navegadores aún lo requieren
  //   });

  //   if (event.key === 'ContextMenu' || event.key === 'Meta') { // Comprueba si la tecla presionada es la tecla de menú (el código de tecla puede variar según el navegador)
  //     event.preventDefault();
  //     this.sidebarVisible = true;
  //     document.dispatchEvent(evnt);
  //   }
  // }
}
