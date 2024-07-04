import { NgModule, Component } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MainPageComponent } from './pages/main-page/main-page.component';
import { LoginComponent } from './52_SIR.ControlUsuarios/login/login.component';
import { RegistroComponent } from './pages/registro/registro.component';
import { ResetPasswordComponent } from './pages/reset-password/reset-password.component';
import { UserComponent } from './pages/user/user.component';
import { AngusFLPComponent } from './03_SIR.Produccion.Reportes/pages/angus-flp/angus-flp.component';
import { InformeHiltonComponent } from './03_SIR.Produccion.Reportes/pages/informe-hilton/informe-hilton.component';
import { InformeChileComponent } from './03_SIR.Produccion.Reportes/pages/informe-chile/informe-chile.component';
import { CajasCongeladoComponent } from './03_SIR.Produccion.Reportes/pages/cajas-congelado/cajas-congelado.component';
import { InformeKosherGalComponent } from './03_SIR.Produccion.Reportes/pages/informe-kosher-gal/informe-kosher-gal.component';
import { InformeKosherUsaComponent } from './03_SIR.Produccion.Reportes/pages/informe-kosher-usa/informe-kosher-usa.component';
import { DetalleCamarasComponent } from './03_SIR.Produccion.Reportes/pages/detalle-camaras/detalle-camaras.component';
import { MenudenciaFaenaOvinaComponent } from './03_SIR.Produccion.Reportes/pages/menudencia-faena-ovina/menudencia-faena-ovina.component';
import { MenudenciaFaenaVacunaComponent } from './03_SIR.Produccion.Reportes/pages/menudencia-faena-vacuna/menudencia-faena-vacuna.component';
import { ProduccionDesosadoOvinoComponent } from './03_SIR.Produccion.Reportes/pages/produccion-desosado-ovino/produccion-desosado-ovino.component';
import { ProduccionDesosadoVacunoComponent } from './03_SIR.Produccion.Reportes/pages/produccion-desosado-vacuno/produccion-desosado-vacuno.component';
import { RechazoPHComponent } from './03_SIR.Produccion.Reportes/pages/rechazo-ph/rechazo-ph.component';
import { ResumenD1Component } from './03_SIR.Produccion.Reportes/pages/resumen-d1/resumen-d1.component';
import { ResumenMarelComponent } from './03_SIR.Produccion.Reportes/pages/resumen-marel/resumen-marel.component';
import { PreciosKosherComponent } from './05_SIR.Carga.Reportes/pages/precios-kosher/precios-kosher.component';
import { ControlCortesComponent } from './02_SIR.Produccion.ControlCortes/pages/control-cortes/control-cortes.component';
import { NoqueoComponent } from './06_SIR.ControlCalidad.Reportes/pages/noqueo/noqueo.component';
import { PccComponent } from './06_SIR.ControlCalidad.Reportes/pages/pcc/pcc.component';
import { PccAuditableComponent } from './06_SIR.ControlCalidad.Reportes/pages/pcc-auditable/pcc-auditable.component';
import { TrazabilidadComponent } from './01_SIR.Produccion.Trazabilidad/pages/trazabilidad/trazabilidad.component';
import { CompresorImagenesComponent } from './54_Herramientas/pages/compresor-imagenes/compresor-imagenes.component';
import { ControlCuartosComponent } from './03_SIR.Produccion.Reportes/pages/control-cuartos/control-cuartos.component';
import { MachuconesComponent } from './06_SIR.ControlCalidad.Reportes/pages/machucones/machucones.component';
import { DashboardComponent } from './shared/dashboard/dashboard.component';
import { GraseriaComponent } from './07_SIR.Mantenimiento.Apps/pages/graseria/graseria.component';
import { DashboardEagleComponent } from './shared/dashboard-eagle/dashboard-eagle.component';
import { LogueoFuncComponent } from './08_SIR.RRHH.Reportes/pages/logueo-func/logueo-func.component';
import { PageHorarioFuncionarioComponent } from './08_SIR.RRHH.Reportes/components/page-horario-funcionario/page-horario-funcionario.component';
import { ControlHorasComponent } from './08_SIR.RRHH.Reportes/pages/control-horas/control-horas.component';
import { WelcomeComponent } from './pages/welcome/welcome.component';
import { DashboardDesosadoComponent } from './07_SIR.Mantenimiento.Apps/pages/dashboard-desosado/dashboard-desosado.component';
import { ConfiguracionMainPageComponent } from './50_SIR.Configuracion.Parametros/pages/configuracion-main-page/configuracion-main-page.component';
import { RechazoCCPHComponent } from './06_SIR.ControlCalidad.Reportes/formularios/rechazo-ph/rechazo-ph.component';
import { DashboardEmpaqueSecundarioComponent } from './07_SIR.Mantenimiento.Apps/pages/dashboard-empaque-secundario/dashboard-empaque-secundario.component';
import { CabezasFaenadasComponent } from './07_SIR.Mantenimiento.Apps/pages/cabezas-faenadas/cabezas-faenadas.component';
import { DispositivosScadaComponent } from './07_SIR.Mantenimiento.Apps/formularios/dispositivos-scada/dispositivos-scada.component';
import { DetalleEmbarqueComponent } from './04_SIR.Exportaciones.Reportes/pages/detalle-embarque/detalle-embarque.component';

const routes: Routes = [
  { path: '', component: LoginComponent},
  { path: 'login', component: LoginComponent},
  { path: 'principal', component: MainPageComponent, children: [
    { path: '', redirectTo: 'welcome', pathMatch: 'full' },
    { path: 'welcome', component: WelcomeComponent},
    { path: 'produccion/angusFLP', component: AngusFLPComponent },
    { path: 'produccion/hilton', component: InformeHiltonComponent },
    { path: 'produccion/chile', component: InformeChileComponent },
    { path: 'produccion/cajasCongelado', component: CajasCongeladoComponent },
    { path: 'produccion/kosherGAL', component: InformeKosherGalComponent },
    { path: 'produccion/kosherUSA', component: InformeKosherUsaComponent },
    { path: 'faena/detalleCamaras', component: DetalleCamarasComponent },
    { path: 'faena/menudenciaFaenaOvina', component: MenudenciaFaenaOvinaComponent },
    { path: 'faena/menudenciaFaenaVacuna', component: MenudenciaFaenaVacunaComponent },
    { path: 'produccion/produccionDesosadoOvino', component: ProduccionDesosadoOvinoComponent },
    { path: 'produccion/produccionDesosadoVacuno', component: ProduccionDesosadoVacunoComponent },
    { path: 'produccion/rechazoPH', component: RechazoPHComponent },
    { path: 'produccion/resumenDesosado1', component: ResumenD1Component },
    { path: 'produccion/resumenDesosadoMarel', component: ResumenMarelComponent},
    { path: 'produccion/controlCortes', component: ControlCortesComponent },
    { path: 'produccion/controlCuartos', component: ControlCuartosComponent },
    { path: 'exportaciones/detalleEmbarque', component: DetalleEmbarqueComponent},
    { path: 'carga/packingList', component: PreciosKosherComponent},
    { path: 'controlCalidad/noqueo', component: NoqueoComponent},
    { path: 'controlCalidad/pcc', component: PccComponent},
    { path: 'controlCalidad/pccAuditable', component: PccAuditableComponent},
    { path: 'controlCalidad/machucones', component: MachuconesComponent},
    { path: 'controlCalidad/rechazoPH', component: RechazoCCPHComponent},
    { path: 'herramientas/trazabilidad', component: TrazabilidadComponent},
    { path: 'herramientas/compresorImagenes', component: CompresorImagenesComponent},
    { path: 'mantenimiento/dashboardScanners', component: DashboardComponent},
    { path: 'mantenimiento/dashboardEagle', component: DashboardEagleComponent},
    { path: 'mantenimiento/reporteGraseria', component: GraseriaComponent},
    { path: 'mantenimiento/dashboardDesosado', component: DashboardDesosadoComponent},
    { path: 'mantenimiento/dashboardEmpaqueSecundario', component: DashboardEmpaqueSecundarioComponent},
    { path: 'mantenimiento/cabezasFaenadas', component: CabezasFaenadasComponent},
    { path: 'mantenimiento/dispositivosScada', component: DispositivosScadaComponent},
    { path: 'rrhh/funcionariosLogueados', component: LogueoFuncComponent},
    { path: 'rrhh/horarioFuncionario', component: PageHorarioFuncionarioComponent},
    { path: 'rrhh/controlHoras', component: ControlHorasComponent},
    { path: 'usuario/:nombreUsuario', component: UserComponent},
    { path: 'configuracion', component:ConfiguracionMainPageComponent}
  ]},
  { path: 'registro', component: RegistroComponent},
  { path: 'resetearContraseña', component: ResetPasswordComponent},
  { path: '**', redirectTo: 'principal/welcome', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
