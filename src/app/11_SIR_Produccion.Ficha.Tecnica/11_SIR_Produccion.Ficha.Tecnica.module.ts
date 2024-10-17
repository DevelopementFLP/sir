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



import { HomeMantenimientoFichaTecnicaComponent } from './pages/home-mantenimiento-ficha-tecnica/home-mantenimiento-ficha-tecnica.component';
import { FtSeccionMarcaComponent } from './components/MantenimientoFichaTecnica/ft-seccion-marca/ft-seccion-marca.component';
import { FtSeccionCondicionAlmacenamientoComponent } from './components/MantenimientoFichaTecnica/ft-seccion-condicion-almacenamiento/ft-seccion-condicion-almacenamiento.component';
import { FtSeccionColorComponent } from './components/MantenimientoFichaTecnica/ft-seccion-color/ft-seccion-color.component';
import { FtSeccionTipoDeUsoComponent } from './components/MantenimientoFichaTecnica/ft-seccion-tipo-de-uso/ft-seccion-tipo-de-uso.component';
import { FtSeccionOlorComponent } from './components/MantenimientoFichaTecnica/ft-seccion-olor/ft-seccion-olor.component';
import { FtSeccionPhComponent } from './components/MantenimientoFichaTecnica/ft-seccion-ph/ft-seccion-ph.component';
import { FtSeccionAlergenosComponent } from './components/MantenimientoFichaTecnica/ft-seccion-alergenos/ft-seccion-alergenos.component';
import { FtSeccionVidaUtilComponent } from './components/MantenimientoFichaTecnica/ft-seccion-vida-util/ft-seccion-vida-util.component';
import { FtSeccionAlimentacionComponent } from './components/MantenimientoFichaTecnica/ft-seccion-alimentacion/ft-seccion-alimentacion.component';
import { FtSeccionTipoDeEnvaseComponent } from './components/MantenimientoFichaTecnica/ft-seccion-tipo-de-envase/ft-seccion-tipo-de-envase.component';
import { FtSeccionTipoPresentacionDeEnvaseComponent } from './components/MantenimientoFichaTecnica/ft-seccion-presentacion-de-envase/ft-seccion-tipo-presentacion-de-envase.component';
import { FichaTecnicaProductoComponent } from './components/GenerarFichaTecnica/generar-tecnica-producto/generar-tecnica-producto.component';
import { CrearProductoFichaTecnicaComponent } from './components/CreacionDeFichaTecnica/crear-producto-ficha-tecnica/crear-producto-ficha-tecnica.component';
import { HomeCrearProductoFichaTecnicaComponent } from './pages/home-crear-ficha-tecnica/home-crear-ficha-tecnica.component';
import { HomeGenerarFichaTecnicaComponent } from './pages/home-generar-ficha-tecnica/home-generar-ficha-tecnica.component';
import { SweetAlertGenericosComponent } from './helper/sweet-alert-genericos/sweet-alert-genericos.component';
import { CrearPlantillaFichaTecnicaComponent } from './components/CreacionDeFichaTecnica/crear-plantilla-ficha-tecnica/crear-plantilla-ficha-tecnica.component';
import { CrearFichaTecnicaComponent } from './components/CreacionDeFichaTecnica/crear-ficha-tecnica/crear-ficha-tecnica.component';
=======
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

      HomeMantenimientoFichaTecnicaComponent,

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

      FtSeccionTipoPresentacionDeEnvaseComponent,
      FichaTecnicaProductoComponent,
      CrearProductoFichaTecnicaComponent,
      HomeCrearProductoFichaTecnicaComponent,
      HomeGenerarFichaTecnicaComponent,
      SweetAlertGenericosComponent,
      CrearPlantillaFichaTecnicaComponent,
      CrearFichaTecnicaComponent     

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
