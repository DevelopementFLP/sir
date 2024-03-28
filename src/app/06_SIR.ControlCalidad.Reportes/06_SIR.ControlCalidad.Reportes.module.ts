import { NgModule } from "@angular/core";
import { PccComponent } from './pages/pcc/pcc.component';
import { PccAuditableComponent } from './pages/pcc-auditable/pcc-auditable.component';
import { NoqueoComponent } from './pages/noqueo/noqueo.component';
import { FormsModule } from "@angular/forms";
import { PrimeNgModule } from "../prime-ng/prime-ng.module";
import { MachuconesComponent } from './pages/machucones/machucones.component';


@NgModule({
  declarations: [
    PccComponent,
    PccAuditableComponent,
    NoqueoComponent,
    MachuconesComponent
  ],
  imports: [
    FormsModule,
    PrimeNgModule
  ]
})
export class ControlCalidadReportesModule{}