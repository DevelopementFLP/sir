import { NgModule } from "@angular/core";
import { MainPageComponent } from './pages/main-page/main-page.component';
import { RechazoPHComponent } from './pages/rechazo-ph/rechazo-ph.component';
import { InformeHiltonComponent } from './pages/informe-hilton/informe-hilton.component';
import { InformeChileComponent } from './pages/informe-chile/informe-chile.component';
import { ResumenMarelComponent } from './pages/resumen-marel/resumen-marel.component';
import { ResumenD1Component } from './pages/resumen-d1/resumen-d1.component';
import { ProduccionDesosadoVacunoComponent } from './pages/produccion-desosado-vacuno/produccion-desosado-vacuno.component';
import { ProduccionDesosadoOvinoComponent } from './pages/produccion-desosado-ovino/produccion-desosado-ovino.component';
import { AngusFLPComponent } from './pages/angus-flp/angus-flp.component';
import { CajasCongeladoComponent } from './pages/cajas-congelado/cajas-congelado.component';
import { InformeKosherGalComponent } from './pages/informe-kosher-gal/informe-kosher-gal.component';
import { InformeKosherUsaComponent } from './pages/informe-kosher-usa/informe-kosher-usa.component';
import { MenudenciaFaenaVacunaComponent } from './pages/menudencia-faena-vacuna/menudencia-faena-vacuna.component';
import { MenudenciaFaenaOvinaComponent } from './pages/menudencia-faena-ovina/menudencia-faena-ovina.component';
import { DetalleCamarasComponent } from './pages/detalle-camaras/detalle-camaras.component';
import { ControlCuartosComponent } from './pages/control-cuartos/control-cuartos.component';
import { PrimeNgModule } from "../prime-ng/prime-ng.module";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { SharedModule } from "../shared/shared.module";
import { MenuComponent } from './pages/stock-cajas/pages/menu/menu.component';
import { CrearPedidoComponent } from './pages/stock-cajas/pages/crear-pedido/crear-pedido.component';
import { CajaComponent } from './pages/stock-cajas/components/caja/caja.component';
import { VerStockComponent } from './pages/stock-cajas/components/ver-stock/ver-stock.component';
import { PedidosActivosComponent } from './pages/stock-cajas/pages/pedidos-activos/pedidos-activos.component';
import { CajasEntregarComponent } from './pages/stock-cajas/pages/cajas-entregar/cajas-entregar.component';
import { BotonVolverComponent } from './pages/stock-cajas/components/boton-volver/boton-volver.component';
import { PedidosRecibidosComponent } from './pages/stock-cajas/pages/pedidos-recibidos/pedidos-recibidos.component';
import { MainComponent } from './pages/stock-cajas/pages/main/main.component';
import { PopUpCantidadComponent } from './pages/stock-cajas/components/pop-up-cantidad/pop-up-cantidad.component';
import { PopUpEditarCantidadComponent } from './pages/stock-cajas/components/pop-up-editar-cantidad/pop-up-editar-cantidad.component';
import { PopUpTamanotipoComponent } from './pages/stock-cajas/components/pop-up-tamanotipo/pop-up-tamanotipo.component';
import { EntregaNoSolicitadaComponent } from './pages/stock-cajas/pages/entrega-no-solicitada/entrega-no-solicitada.component';
import { ReporteCuotaComponent } from './pages/cuota/pages/reporte-cuota/reporte-cuota.component';
import { ReporteCuotaDisplayComponent } from './pages/cuota/components/reporte-cuota-display/reporte-cuota-display.component';
import { SplitterModule } from 'primeng/splitter';
import { RendimientosComponent } from "./pages/rendimientos/rendimientos.component";
import { RendimientoViewerComponent } from "./pages/rendimientos/components/rendimiento-viewer/rendimiento-viewer.component";
import { ComparativoViewerComponent } from "./pages/rendimientos/components/comparativo-viewer/comparativo-viewer.component";
import { ComparativoCodigosComponent } from './components/comparativo-codigos/comparativo-codigos.component';
import { NuevoGrupoComponent } from './components/nuevo-grupo/nuevo-grupo.component';
import { ComparativoCodigosPageComponent } from './pages/comparativo-codigos-page/comparativo-codigos-page.component';
import { EscapeKeyDirective } from './directives/escape-key.directive';
import { EditarPedidoComponent } from './pages/stock-cajas/pages/editar-pedido/editar-pedido.component';



@NgModule({
    declarations: [
        AngusFLPComponent,
        CajasCongeladoComponent,
        ControlCuartosComponent,
        DetalleCamarasComponent,
        InformeChileComponent,
        InformeHiltonComponent,
        InformeKosherGalComponent,
        InformeKosherUsaComponent,
        MainPageComponent,
        MenudenciaFaenaOvinaComponent,
        MenudenciaFaenaVacunaComponent,
        ProduccionDesosadoOvinoComponent,
        ProduccionDesosadoVacunoComponent,
        RechazoPHComponent,
        ResumenD1Component,
        ResumenMarelComponent,
        MenuComponent,
        CrearPedidoComponent,
        CajaComponent,
        VerStockComponent,
        PedidosActivosComponent,
        CajasEntregarComponent,
        BotonVolverComponent,
        PedidosRecibidosComponent,
        MainComponent,
        PopUpCantidadComponent,
        PopUpEditarCantidadComponent,
        PopUpTamanotipoComponent,
        EntregaNoSolicitadaComponent,
        ReporteCuotaComponent,
        ReporteCuotaDisplayComponent,
        RendimientosComponent,
        RendimientoViewerComponent,
        ComparativoViewerComponent,
        ComparativoCodigosComponent,
        NuevoGrupoComponent,
        ComparativoCodigosPageComponent,
        EscapeKeyDirective
        EditarPedidoComponent
    ],
    exports: [
        MainPageComponent
    ],
    imports: [
        PrimeNgModule,
        CommonModule,
        FormsModule,
        SharedModule,
        ReactiveFormsModule,
        SplitterModule
    ]
})

export class ProduccionReportesModule{}