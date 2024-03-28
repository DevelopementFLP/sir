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
import { FormsModule } from "@angular/forms";
import { SharedModule } from "../shared/shared.module";



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
    ],
    exports: [
        MainPageComponent
    ],
    imports: [
        PrimeNgModule,
        CommonModule,
        FormsModule,
        SharedModule,
    ]
})

export class ProduccionReportesModule{}