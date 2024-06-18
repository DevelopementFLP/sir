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
import { DashboardDesosadoComponent } from './pages/dashboard-desosado/dashboard-desosado.component';
import { DetalleCharqueadoresComponent } from './components/detalle-charqueadores/detalle-charqueadores.component';
import { LotesEntradaComponent } from './components/lotes-entrada/lotes-entrada.component';
import { DataCharqueoComponent } from './components/data-charqueo/data-charqueo.component';
import { DataHueseroComponent } from './components/data-huesero/data-huesero.component';
import { DataHueseroViewerComponent } from './components/data-huesero-viewer/data-huesero-viewer.component';
import { TotalHueseroComponent } from './components/total-huesero/total-huesero.component';
import { TotalCharqueoComponent } from './components/total-charqueo/total-charqueo.component';
import { TotalEmpaqueComponent } from './components/total-empaque/total-empaque.component';
import { DataEmpaqueComponent } from './components/data-empaque/data-empaque.component';
import { DataCharqueoViewerComponent } from './components/data-charqueo-viewer/data-charqueo-viewer.component';
import { DataLineViewerComponent } from './components/data-line-viewer/data-line-viewer.component';
import { DetalleHueserosComponent } from './components/detalle-hueseros/detalle-hueseros.component';
import { DashboardEmpaqueSecundarioComponent } from './pages/dashboard-empaque-secundario/dashboard-empaque-secundario.component';
import { TMSViewrComponent } from './components/tms-viewer/tmsviewr.component';
import { VelocidadCerradoComponent } from './components/velocidad-cerrado/velocidad-cerrado.component';
import { KilosMinutoComponent } from './components/kilos-minuto/kilos-minuto.component';
import { LineaEmpaqueComponent } from './components/linea-empaque/linea-empaque.component';
import { PuestoEstacionComponent } from './components/puesto-estacion/puesto-estacion.component';
import { CortesPorEstacionComponent } from './components/cortes-por-estacion/cortes-por-estacion.component';
import { CabezasFaenadasComponent } from './pages/cabezas-faenadas/cabezas-faenadas.component';
import { DispositivosScadaComponent } from './formularios/dispositivos-scada/dispositivos-scada.component';

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
    GraseriaComponent,
    DashboardDesosadoComponent,
    DetalleCharqueadoresComponent,
    LotesEntradaComponent,
    DataCharqueoComponent,
    DataHueseroComponent,
    DataHueseroViewerComponent,
    TotalHueseroComponent,
    TotalCharqueoComponent,
    TotalEmpaqueComponent,
    DataEmpaqueComponent,
    DataCharqueoViewerComponent,
    DataLineViewerComponent,
    DetalleHueserosComponent,
    DashboardEmpaqueSecundarioComponent,
    TMSViewrComponent,
    VelocidadCerradoComponent,
    KilosMinutoComponent,
    LineaEmpaqueComponent,
    PuestoEstacionComponent,
    CortesPorEstacionComponent,
    CabezasFaenadasComponent,
    DispositivosScadaComponent
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
