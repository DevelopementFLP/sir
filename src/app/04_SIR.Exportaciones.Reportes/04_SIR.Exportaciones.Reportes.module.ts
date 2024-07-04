import { NgModule } from "@angular/core";
import { ConfigPreciosComponent } from './components/config-precios/config-precios.component';
import { PrimeNgModule } from "../prime-ng/prime-ng.module";
import { FormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { AdminPreciosComponent } from './components/admin-precios/admin-precios.component';
import { DetalleEmbarqueComponent } from './pages/detalle-embarque/detalle-embarque.component';


@NgModule({
  declarations: [
    AdminPreciosComponent,
    ConfigPreciosComponent,
    DetalleEmbarqueComponent
  
  ],
  imports: [
    CommonModule,
    PrimeNgModule,
    FormsModule
  ]
})

export class ExportacionesReportesModule{}