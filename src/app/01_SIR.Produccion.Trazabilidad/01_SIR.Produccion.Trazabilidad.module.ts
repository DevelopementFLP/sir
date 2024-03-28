import { NgModule } from "@angular/core";

import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { PrimeNgModule } from "../prime-ng/prime-ng.module";

import { TrazabilidadComponent } from './pages/trazabilidad/trazabilidad.component';
import { TrazaComponent } from './components/traza/traza.component';
import { SharedModule } from "../shared/shared.module";
import { DatePipe } from '@angular/common';



@NgModule({
  declarations: [
    TrazabilidadComponent,
    TrazaComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    PrimeNgModule,
    SharedModule
  ],
  providers:[
    DatePipe
  ]
})

export class TrazabilidadModule {}