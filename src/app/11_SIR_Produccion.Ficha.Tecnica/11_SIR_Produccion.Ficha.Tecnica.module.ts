import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';


import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { OrderListModule } from 'primeng/orderlist';
import { TableModule } from 'primeng/table';
import { PaginatorModule } from 'primeng/paginator';
import { CardModule } from 'primeng/card';
import { TabViewModule } from 'primeng/tabview';
import { PanelModule } from 'primeng/panel';


import { HomeFichaTecnicaComponent } from './pages/home-ficha-tecnica/home-ficha-tecnica.component';
import { FtSeccionMarcaComponent } from './components/ft-seccion-marca/ft-seccion-marca.component';
import { FtSeccionCondicionAlmacenamientoComponent } from './components/ft-seccion-condicion-almacenamiento/ft-seccion-condicion-almacenamiento.component';
import { FtSeccionColorComponent } from './components/ft-seccion-color/ft-seccion-color.component';
import { FtSeccionTipoDeUsoComponent } from './components/ft-seccion-tipo-de-uso/ft-seccion-tipo-de-uso.component';
import { FtSeccionOlorComponent } from './components/ft-seccion-olor/ft-seccion-olor.component';
import { FtSeccionPhComponent } from './components/ft-seccion-ph/ft-seccion-ph.component';
import { FtSeccionAlergenosComponent } from './components/ft-seccion-alergenos/ft-seccion-alergenos.component';
import { FtSeccionVidaUtilComponent } from './components/ft-seccion-vida-util/ft-seccion-vida-util.component';
import { FtSeccionAlimentacionComponent } from './components/ft-seccion-alimentacion/ft-seccion-alimentacion.component';
import { FtSeccionTipoDeEnvaseComponent } from './components/ft-seccion-tipo-de-envase/ft-seccion-tipo-de-envase.component';
import { FtSeccionTipoPresentacionDeEnvaseComponent } from './components/ft-seccion-presentacion-de-envase/ft-seccion-tipo-presentacion-de-envase.component';



@NgModule({
  declarations: [
      HomeFichaTecnicaComponent,
      FtSeccionMarcaComponent,
      FtSeccionCondicionAlmacenamientoComponent,
      FtSeccionColorComponent,
      FtSeccionTipoDeUsoComponent,
      FtSeccionOlorComponent,
      FtSeccionPhComponent,
      FtSeccionAlergenosComponent,
      FtSeccionVidaUtilComponent,
      FtSeccionAlimentacionComponent,
      FtSeccionTipoDeEnvaseComponent,
      FtSeccionTipoPresentacionDeEnvaseComponent     
  ],
  exports:[
    
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    CalendarModule,
    DropdownModule,
    OrderListModule,
    TableModule,
    PaginatorModule,
    CardModule,
    TabViewModule,
    PanelModule
  ]
})
export class ProduccionFichaTecnicaModule { }
