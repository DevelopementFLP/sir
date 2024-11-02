import { NgModule } from "@angular/core";
import { PreciosKosherComponent } from './pages/precios-kosher/precios-kosher.component';
import { FormsModule } from "@angular/forms";
import { PrimeNgModule } from "../prime-ng/prime-ng.module";
import { ConfiguracionPreciosKosherComponent } from './pages/configuracion-precios-kosher/configuracion-precios-kosher.component';
import { CommonModule } from "@angular/common";
import { SharedModule } from "../shared/shared.module";
import { PLPerCartonComponent } from './components/plper-carton/plper-carton.component';
import { PLPerPalletComponent } from './components/plper-pallet/plper-pallet.component';
import { XCUTComponent } from './components/xcut/xcut.component';
import { XFCLComponent } from './components/xfcl/xfcl.component';
import { XfclViewerComponent } from './components/xfcl-viewer/xfcl-viewer.component';
import { XcutViewerComponent } from './components/xcut-viewer/xcut-viewer.component';


@NgModule({
  declarations: [
    PreciosKosherComponent,
    ConfiguracionPreciosKosherComponent,
    PLPerCartonComponent,
    PLPerPalletComponent,
    XCUTComponent,
    XFCLComponent,
    XfclViewerComponent,
    XcutViewerComponent
  ],
  imports: [
    FormsModule,
    PrimeNgModule,
    CommonModule,
    SharedModule
  ]
})
export class CargaReportesModule {}