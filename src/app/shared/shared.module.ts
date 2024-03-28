import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from '../app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ExportacionComponent } from './exportacion/exportacion.component';
import { MaterialThemeModule } from '../MaterialTheme/MaterialTheme.module';
import { MenuLateralComponent } from './menu-lateral/menu-lateral.component';
import { ModalComponent } from './modal/modal.component';
import { NavbarComponent } from './navbar/navbar.component';
import { PrimeNgModule } from '../prime-ng/prime-ng.module';
import { ProfileMenuComponent } from './profile-menu/profile-menu.component';
import { LoadingSpinnerComponent } from './loading-spinner/loading-spinner.component';
import { EncabezadoReporteComponent } from './encabezado-reporte/encabezado-reporte.component';
import { DashboardEagleComponent } from './dashboard-eagle/dashboard-eagle.component';



@NgModule({
  declarations: [
    DashboardComponent,
    EncabezadoReporteComponent,
    ExportacionComponent,
    LoadingSpinnerComponent,
    MenuLateralComponent,
    ModalComponent,
    NavbarComponent,
    ProfileMenuComponent,
    DashboardEagleComponent,
  ],
  exports: [
    EncabezadoReporteComponent,
    ExportacionComponent,
    LoadingSpinnerComponent,
    MenuLateralComponent,
    ModalComponent,
    NavbarComponent,
  ],
  imports: [
    AppRoutingModule,
    BrowserAnimationsModule,
    CommonModule,
    MaterialThemeModule,
    PrimeNgModule,
  ]
})
export class SharedModule { }
