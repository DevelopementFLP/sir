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
  groupedMenuItems: MenuItem[] = [];
  constructor(
    private navBarService: NavBarService
  ) {}
  
  
  ngOnInit(): void {
    setTimeout(() => {
      this.menuItems = this.navBarService.getSideBarMenu();
      this.menuItems.sort((a, b) => {
        if(a.label! <= b.label!) return -1;
        return 1;
      })
      this.menuItems = this.navBarService.transformarAMenuItems(this.menuItems);
     
    }, 100);
  }

  // async ngOnInit(): Promise<void> {
  //     this.menuItems = await this.navBarService.getSideBarMenu();
  //     this.menuItems = await this.navBarService.transformarAMenuItems(this.menuItems);
  //     console.log(this.menuItems)
  //     console.log(this.groupedMenuItems)
  // }

}
