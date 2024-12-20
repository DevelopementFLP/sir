import { NgModule, LOCALE_ID } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { NgxWebstorageModule } from 'ngx-webstorage';

import { ConfirmationService, MessageService } from 'primeng/api';
import { CONFIRMATION_SERVICE_TOKEN, MESSAGE_SERVICE_TOKEN } from './shared/services/tokens/messages.tokens';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { ControlUsuariosModule } from './52_SIR.ControlUsuarios/52_SIR.ControlUsuarios.module';
import { SharedModule } from './shared/shared.module';

import { MaterialThemeModule } from './MaterialTheme/MaterialTheme.module';
import { MainPageComponent } from './pages/main-page/main-page.component';
import { ResetPasswordComponent } from './pages/reset-password/reset-password.component';
import { RegistroComponent } from './pages/registro/registro.component';
import { UserComponent } from './pages/user/user.component';
import { FormsModule } from '@angular/forms';
import { PrimeNgModule } from './prime-ng/prime-ng.module';
import { ReportesComponent } from './53_SIR.Configuracion.Reportes/reportes/reportes.component';
import { ProduccionReportesModule } from './03_SIR.Produccion.Reportes/03_SIR.Produccion.module';
import { TrazabilidadModule } from './01_SIR.Produccion.Trazabilidad/01_SIR.Produccion.Trazabilidad.module';
import { ExportacionesReportesModule } from './04_SIR.Exportaciones.Reportes/04_SIR.Exportaciones.Reportes.module';
import { CargaReportesModule } from './05_SIR.Carga.Reportes/05_SIR.Carga.Reportes.module';
import { ControlCalidadReportesModule } from './06_SIR.ControlCalidad.Reportes/06_SIR.ControlCalidad.Reportes.module';
import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';
import { MantenimientoAppsModule } from './07_SIR.Mantenimiento.Apps/07_SIR.Mantenimiento.Apps.module';
import { ApiInterceptor } from './shared/interceptors/api.interceptor';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { RRHHReportesModule } from './08_SIR.RRHH.Reportes/08_SIR.RRHH.Reportes.module';
import { WelcomeComponent } from './pages/welcome/welcome.component';
import { SIRConfiguracionParametrosModule } from './50_SIR.Configuracion.Parametros/sir.configuracion.parametros.module';
import { MatDialogModule } from '@angular/material/dialog';
import { DispositivoModule } from './09_SIR.Dispositivos.Apps/09_SIR.Dispositivo.Apps.module';
import { FaenaModule } from './10_Sir.Faena.Apps/10_Sir_Faena.Apps.module';
import { ProduccionFichaTecnicaModule } from './11_SIR_Produccion.Ficha.Tecnica/11_SIR_Produccion.Ficha.Tecnica.module';
import { ProduccionControlDeCalidadModule } from './12_SIR_Produccion.ControlDeCalidad/12_Sir_Produccion_ControlDeCalidad.module';
import { SolicitudCompraComponent } from './13_SIR_Compras.Reportes/pages/solicitud-compra/solicitud-compra.component';
import { CrearProductoComponent } from './13_SIR_Compras.Reportes/pages/altas/crear-producto/crear-producto.component';
import { CrearEmpresaComponent } from './13_SIR_Compras.Reportes/pages/altas/crear-empresa/crear-empresa.component';
import { CrearAtributoComponent } from './13_SIR_Compras.Reportes/pages/altas/crear-atributo/crear-atributo.component';
import { CrearDepartamentoComponent } from './13_SIR_Compras.Reportes/pages/altas/crear-departamento/crear-departamento.component';
import { CrearCentroDeCostoComponent } from './13_SIR_Compras.Reportes/pages/altas/crear-centro-de-costo/crear-centro-de-costo.component';
import { CrearAreaDestinoComponent } from './13_SIR_Compras.Reportes/pages/altas/crear-area-destino/crear-area-destino.component';
import { CrearAlmacenComponent } from './13_SIR_Compras.Reportes/pages/altas/crear-almacen/crear-almacen.component';
import { CrearUnidadComponent } from './13_SIR_Compras.Reportes/pages/altas/crear-unidad/crear-unidad.component';
import { ComprasConfiguracionComponent } from './13_SIR_Compras.Reportes/pages/compras-configuracion/compras-configuracion.component';
import { MenuComprasComponent } from './13_SIR_Compras.Reportes/pages/menu-compras/menu-compras.component';
import { StockProductoComponent } from './13_SIR_Compras.Reportes/pages/altas/stock-producto/stock-producto.component';
import { CrearUsuarioComponent } from './13_SIR_Compras.Reportes/pages/altas/crear-usuario/crear-usuario.component';
import { CrearPrioridadComponent } from './13_SIR_Compras.Reportes/pages/altas/crear-prioridad/crear-prioridad.component';
import { CrearEstadoSolicitudComponent } from './13_SIR_Compras.Reportes/pages/altas/crear-estado-solicitud/crear-estado-solicitud.component';
import { CrearRolComponent } from './13_SIR_Compras.Reportes/pages/altas/crear-rol/crear-rol.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatExpansionModule } from '@angular/material/expansion';

registerLocaleData(localeEs);

@NgModule({
  declarations: [
    AppComponent,
    MainPageComponent,
    ResetPasswordComponent,
    RegistroComponent,
    UserComponent,
    ReportesComponent,
    WelcomeComponent,
    SolicitudCompraComponent,
    CrearProductoComponent,
    CrearEmpresaComponent,
    CrearAtributoComponent,
    CrearDepartamentoComponent,
    CrearCentroDeCostoComponent,
    CrearAreaDestinoComponent,
    CrearAlmacenComponent,
    CrearUnidadComponent,
    ComprasConfiguracionComponent,
    MenuComprasComponent,
    StockProductoComponent,
    CrearUsuarioComponent,
    CrearPrioridadComponent,
    CrearEstadoSolicitudComponent,
    CrearRolComponent
  ],
  imports: [
    AppRoutingModule,
    BrowserAnimationsModule,
    BrowserModule,
    CargaReportesModule,
    ControlCalidadReportesModule,
    ControlUsuariosModule,
    ExportacionesReportesModule,
    FormsModule,
    HttpClientModule,
    MaterialThemeModule,
    NgxWebstorageModule.forRoot(),
    PrimeNgModule,
    ProduccionReportesModule,
    SharedModule,
    TrazabilidadModule,
    MantenimientoAppsModule,
    NgxUiLoaderModule,
    RRHHReportesModule,
    SIRConfiguracionParametrosModule,
    MatDialogModule,
    DispositivoModule,
    FaenaModule,
    ProduccionFichaTecnicaModule,
    ProduccionControlDeCalidadModule,
    MatPaginatorModule,
    MatTableModule,
    MatExpansionModule
    
  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'es-ES' },
    { provide: HTTP_INTERCEPTORS, useClass: ApiInterceptor, multi: true},
    { provide: CONFIRMATION_SERVICE_TOKEN, useClass: ConfirmationService },
    { provide: MESSAGE_SERVICE_TOKEN, useClass: MessageService }
   
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
