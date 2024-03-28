import { Component, OnInit } from '@angular/core';

import { DataService } from '../services/data.service';
import { Reporte } from '../models/reporte.interface';
import { SessionManagerService } from '../services/session-manager.service';
import { MenuItem } from 'primeng/api';
import { MainMenuService } from '../services/main-menu.service';

@Component({
  selector: 'app-menu-lateral',
  templateUrl: './menu-lateral.component.html',
  styleUrls: ['./menu-lateral.component.css'],
})
export class MenuLateralComponent implements OnInit {
  reportes: Reporte[] = [];
  menuItems: MenuItem[] = [];

  constructor(
    private dataService: DataService,
    private sessionManager: SessionManagerService,
    private mainMenuService: MainMenuService
  ) {}

  ngOnInit(): void {
    const usuarioActual = this.sessionManager.getStorage();
    if (usuarioActual != null && usuarioActual != undefined) {
      this.dataService.getReportesPorAcceso(usuarioActual.id_perfil).subscribe(
        (reportes: any[]) => {
          this.menuItems = this.transformarAMenuItems(reportes);
        },
        (error) => {
          console.log('Error: ', error);
        }
      );
    }
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

  handleSubMenuItemClick(item: MenuItem) {
    this.mainMenuService.closeMenu();
  }
}
