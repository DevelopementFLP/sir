import { NgModule, LOCALE_ID } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { NgxWebstorageModule } from 'ngx-webstorage';


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


registerLocaleData(localeEs);

@NgModule({
  declarations: [
    AppComponent,
    MainPageComponent,
    ResetPasswordComponent,
    RegistroComponent,
    UserComponent,
    ReportesComponent
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
    RRHHReportesModule
  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'es-ES' },
    { provide: HTTP_INTERCEPTORS, useClass: ApiInterceptor, multi: true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
