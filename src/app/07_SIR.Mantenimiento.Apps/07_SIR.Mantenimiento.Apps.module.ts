import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardScannersComponent } from './pages/dashboard-scanners/dashboard-scanners.component';
import { CardComponent } from './components/card/card.component';
import { CardContainerComponent } from './components/card-container/card-container.component';
import { DataViewerComponent } from './components/data-viewer/data-viewer.component';
import { ScanComponent } from './components/scan/scan.component';
import { ScannersListComponent } from './components/scanners-list/scanners-list.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { NoConnectionComponent } from './components/no-connection/no-connection.component';
import { MantenimientoRoutingModule } from './Mantenimiento-routing.module';
import { PrimeNgModule } from '../prime-ng/prime-ng.module';
import { GraseriaComponent } from './pages/graseria/graseria.component';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [
    DashboardScannersComponent,
    CardComponent,
    CardContainerComponent,
    DataViewerComponent,
    ScanComponent,
    ScannersListComponent,
    NotFoundComponent,
    NoConnectionComponent,
    GraseriaComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    MantenimientoRoutingModule,
    PrimeNgModule,
    SharedModule
  
  ],
  exports: [
    CardComponent,
    CardContainerComponent,
    DataViewerComponent,
    ScanComponent,
    ScannersListComponent,
    NotFoundComponent,
    NoConnectionComponent,
    GraseriaComponent
  ]
})
export class MantenimientoAppsModule { }
