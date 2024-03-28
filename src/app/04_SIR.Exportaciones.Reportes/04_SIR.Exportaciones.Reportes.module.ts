import { NgModule } from "@angular/core";
import { DetalleEmbarqueComponent } from './pages/detalle-embarque/detalle-embarque.component';
import { PrimeNgModule } from "../prime-ng/prime-ng.module";
import { FormsModule } from "@angular/forms";


@NgModule({
  declarations: [
    DetalleEmbarqueComponent
  ],
  imports: [
    PrimeNgModule,
    FormsModule
  ]
})

export class ExportacionesReportesModule{}