import { NgModule } from "@angular/core";
import { PccComponent } from './pages/pcc/pcc.component';
import { PccAuditableComponent } from './pages/pcc-auditable/pcc-auditable.component';
import { NoqueoComponent } from './pages/noqueo/noqueo.component';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { PrimeNgModule } from "../prime-ng/prime-ng.module";
import { MachuconesComponent } from './pages/machucones/machucones.component';
import { RechazoCCPHComponent } from './formularios/rechazo-ph/rechazo-ph.component';
import { CommonModule } from "@angular/common";
import { PHConfirmDialogComponent } from './components/phconfirm-dialog/phconfirm-dialog.component';


@NgModule({
  declarations: [
    PccComponent,
    PccAuditableComponent,
    NoqueoComponent,
    MachuconesComponent,
    RechazoCCPHComponent,
    PHConfirmDialogComponent
  ],
  imports: [
    FormsModule,
    PrimeNgModule,
    ReactiveFormsModule,
    CommonModule
  ]
})
export class ControlCalidadReportesModule{}