import { NgModule } from "@angular/core";
import { ConfigPreciosComponent } from './components/config-precios/config-precios.component';
import { PrimeNgModule } from "../prime-ng/prime-ng.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { AdminPreciosComponent } from './components/admin-precios/admin-precios.component';
import { DetalleEmbarqueComponent } from './pages/detalle-embarque/detalle-embarque.component';
import { EmbarqueConfigComponent } from './components/embarque-config/embarque-config.component';
import { CortesGroupComponent } from './components/cortes-group/cortes-group.component';
import { SharedModule } from "../shared/shared.module";
import { DataShowComponent } from './components/data-show/data-show.component';
import { TotalShowComponent } from './components/total-show/total-show.component';
import { AddCodigosComponent } from './components/add-codigos/add-codigos.component';
import { CodigoPrecioFaltanteComponent } from './components/codigo-precio-faltante/codigo-precio-faltante.component';
import { NuevoPrecioComponent } from './components/nuevo-precio/nuevo-precio.component';
import { PesoNetoContenedorComponent } from './components/peso-neto-contenedor/peso-neto-contenedor.component';


@NgModule({
  declarations: [
    AdminPreciosComponent,
    ConfigPreciosComponent,
    DetalleEmbarqueComponent,
    EmbarqueConfigComponent,
    CortesGroupComponent,
    DataShowComponent,
    TotalShowComponent,
    AddCodigosComponent,
    CodigoPrecioFaltanteComponent,
    NuevoPrecioComponent,
    PesoNetoContenedorComponent,
  ],
  imports: [
    CommonModule,
    PrimeNgModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule
]
})

export class ExportacionesReportesModule{}