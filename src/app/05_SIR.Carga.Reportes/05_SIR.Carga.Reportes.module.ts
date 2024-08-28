import { NgModule } from "@angular/core";
import { PreciosKosherComponent } from './pages/precios-kosher/precios-kosher.component';
import { FormsModule } from "@angular/forms";
import { PrimeNgModule } from "../prime-ng/prime-ng.module";
import { ConfiguracionPreciosKosherComponent } from './pages/configuracion-precios-kosher/configuracion-precios-kosher.component';


@NgModule({
  declarations: [
    PreciosKosherComponent,
    ConfiguracionPreciosKosherComponent
  ],
  imports: [
    FormsModule,
    PrimeNgModule
  ]
})
export class CargaReportesModule {}