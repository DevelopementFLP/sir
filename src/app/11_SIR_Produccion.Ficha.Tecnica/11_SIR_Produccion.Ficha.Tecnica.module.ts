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
import { FichaTecnicaProductoComponent } from './components/GenerarFichaTecnica/generar-ficha-tecnica-producto.component';
import { CrearProductoFichaTecnicaComponent } from './components/CreacionDeFichaTecnica/crear-producto-ficha-tecnica/crear-producto-ficha-tecnica.component';
import { HomeCrearProductoFichaTecnicaComponent } from './pages/home-crear-ficha-tecnica/home-crear-ficha-tecnica.component';
import { HomeGenerarFichaTecnicaComponent } from './pages/home-generar-ficha-tecnica/home-generar-ficha-tecnica.component';
import { SweetAlertGenericosComponent } from './helper/sweet-alert-genericos/sweet-alert-genericos.component';
import { CrearPlantillaFichaTecnicaComponent } from './components/CreacionDeFichaTecnica/crear-plantilla-ficha-tecnica/crear-plantilla-ficha-tecnica.component';
import { CrearFichaTecnicaComponent } from './components/CreacionDeFichaTecnica/crear-ficha-tecnica/crear-ficha-tecnica.component';
import { FtSeccionDestinoComponent } from './components/MantenimientoFichaTecnica/ft-seccion-destino/ft-seccion-destino.component';

import { ButtonModule } from 'primeng/button';
import { LisaDeFichasTecnicasComponent } from './components/ListaDeFichasTecnicas/lisa-de-fichas-tecnicas.component';
import { AppRoutingModule } from '../app-routing.module';
import { RouterModule } from '@angular/router';
import { EditarFichaTecnicaComponent } from './modal/FichaTecnica/modal-editar-ficha-tecnica/editar-ficha-tecnica.component';

import { DialogModule } from 'primeng/dialog';
import { MatDialogModule } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ModalVerFichaTecnicaComponent } from './modal/FichaTecnica/modal-ver-ficha-tecnica/modal-ver-ficha-tecnica.component';
import { ModalEditarFotoFichaTecnicaComponent } from './modal/FichaTecnica/modal-editar-foto-ficha-tecnica/modal-editar-foto-ficha-tecnica.component';
import { FileUploadModule } from 'primeng/fileupload';
import { ListaDePlantillasComponent } from './components/ListaDePlantillas/lista-de-plantillas.component';
import { ModalplantillaAspectosGeneralesComponent } from './modal/plantillas/modalplantilla-aspectos-generales/modalplantilla-aspectos-generales.component';
import { ModalplantillaEspecificacionesComponent } from './modal/plantillas/modalplantilla-especificaciones/modalplantilla-especificaciones.component';



@NgModule({
  declarations: [
      HomeMantenimientoFichaTecnicaComponent,
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
      CrearFichaTecnicaComponent,
      FtSeccionDestinoComponent,
      LisaDeFichasTecnicasComponent,
      EditarFichaTecnicaComponent,
      ModalVerFichaTecnicaComponent,
      ModalEditarFotoFichaTecnicaComponent,
      ListaDePlantillasComponent,
      ModalplantillaAspectosGeneralesComponent,
      ModalplantillaEspecificacionesComponent,
  ],
  exports:[
    ModalVerFichaTecnicaComponent
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
    PanelModule,
    ButtonModule,
    AppRoutingModule,
    RouterModule,
    DialogModule,
    MatDialogModule,
    BrowserAnimationsModule,
    FileUploadModule
  ]
})
export class ProduccionFichaTecnicaModule { }
