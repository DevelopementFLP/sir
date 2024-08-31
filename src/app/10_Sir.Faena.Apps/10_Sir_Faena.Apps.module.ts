


import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { MatExpansionModule } from '@angular/material/expansion';
import { ReporteAbastoComponent } from './Pages/ReporteAbasto/reporte-abasto.component';
import { FormularioAbastoComponent } from './Pages/FormularioAbasto/formulario-abasto.component';
import { MatListModule } from '@angular/material/list';
import { MatDialogModule } from '@angular/material/dialog';
import { ModalAbastoComponent } from './Pages/FormularioAbasto/ModalFormularioAbasto/modal-abasto.component';
import { MatSelectModule } from '@angular/material/select';
import { MatGridListModule } from '@angular/material/grid-list';
import { ReactiveFormsModule } from '@angular/forms';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { HttpClientModule } from '@angular/common/http';


@NgModule({
  declarations: [
    FormularioAbastoComponent,
    ReporteAbastoComponent,
    ModalAbastoComponent
  ],
  exports:[
    FormularioAbastoComponent,
    ReporteAbastoComponent
  ],
  imports: [
    CommonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatTableModule,
    MatIconModule,
    FormsModule,
    MatExpansionModule,
    MatListModule,
    MatDialogModule,
    MatSelectModule,
    MatGridListModule,
    ReactiveFormsModule,
    MatPaginatorModule,
    MatDatepickerModule,
    MatCheckboxModule,
    HttpClientModule
  ]
})
export class FaenaModule { }
