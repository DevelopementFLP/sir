import { NgModule } from "@angular/core";
import { DetalleEmbarqueComponent } from './pages/detalle-embarque/detalle-embarque.component';
import { PrimeNgModule } from "../prime-ng/prime-ng.module";
import { FormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";


@NgModule({
  declarations: [
    DetalleEmbarqueComponent
  ],
  imports: [
    CommonModule,
    PrimeNgModule,
    FormsModule
  ]
})

export class ExportacionesReportesModule{}