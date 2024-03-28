import { NgModule } from "@angular/core";
import { PreciosKosherComponent } from './pages/precios-kosher/precios-kosher.component';
import { FormsModule } from "@angular/forms";
import { PrimeNgModule } from "../prime-ng/prime-ng.module";


@NgModule({
  declarations: [
    PreciosKosherComponent
  ],
  imports: [
    FormsModule,
    PrimeNgModule
  ]
})
export class CargaReportesModule {}