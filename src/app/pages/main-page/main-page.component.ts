import { Component, ElementRef, HostListener } from '@angular/core';
import { MainMenuService } from 'src/app/shared/services/main-menu.service';
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

  constructor(
    private sessionManagerService: SessionManagerService,
    private navigationService: NavigationService,
    private elementRef: ElementRef,
    private mainMenuService: MainMenuService
  ) {

    if(this.sessionManagerService.getStorage() == null)
      this.navigationService.navegar('login');
  }

  onToogleSideNav(data: SideNavToogle): void {
    this.screenWidth = data.screenWidth;
    this.isSideNavCollapsed = data.collapsed;
  }

  @HostListener('document:click', ['$event'])
  onClick(event: Event) {
    const menuContent = this.elementRef.nativeElement.querySelector('#menuContent');
    const menuButton = this.elementRef.nativeElement.querySelector('#icon');

    if (menuContent && !menuContent.contains(event.target) && menuButton && !menuButton.contains(event.target)) {
      this.mainMenuService.closeMenu();
    }
  } 
}
