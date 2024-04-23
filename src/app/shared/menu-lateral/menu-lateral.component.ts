import { Component, OnInit } from '@angular/core';


import { MenuItem } from 'primeng/api';
import { NavBarService } from '../services/nav-bar.service';

@Component({
  selector: 'app-menu-lateral',
  templateUrl: './menu-lateral.component.html',
  styleUrls: ['./menu-lateral.component.css'],
})
export class MenuLateralComponent implements OnInit {

  menuItems: MenuItem[] = [];

  constructor(
    private navBarService: NavBarService
  ) {}
  
  
  ngOnInit(): void {
    setTimeout(() => {
      this.menuItems = this.navBarService.getSideBarMenu();
      this.menuItems = this.navBarService.transformarAMenuItems(this.menuItems);
    }, 100);
  }

}
