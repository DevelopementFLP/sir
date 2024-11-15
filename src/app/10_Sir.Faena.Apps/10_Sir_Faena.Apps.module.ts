
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';


import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatListModule } from '@angular/material/list';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {MatCheckboxModule} from '@angular/material/checkbox';



import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { OrderListModule } from 'primeng/orderlist';
import { TableModule } from 'primeng/table';
import { PaginatorModule } from 'primeng/paginator';
import { CardModule } from 'primeng/card';
import { TabViewModule } from 'primeng/tabview';



import { ReporteAbastoComponent } from './Pages/ReporteAbasto/reporte-abasto.component';
import { FormularioAbastoComponent } from './Pages/FormularioAbasto/formulario-abasto.component';
import { ModalAbastoComponent } from './Pages/FormularioAbasto/ModalFormularioAbasto/modal-abasto.component';
import { ReporteDeMediasComponent } from './Pages/ReporteResumenDeCuarteo/reporte-resumen-de-cuarteo.component';

import { ComponenteReporteFaenaProveedorComponent } from './Components/component-reporte-resumen-cuarteo-proveedor/component-reporte-resumen-cuarteo-proveedor.component';
import { BodyReporteMediasComponent } from './Components/body-reporte-resumen-de-cuarteo/body-reporte-resumen-de-cuarteo.component';

@NgModule({
  declarations: [
    FormularioAbastoComponent,
    ReporteAbastoComponent,
    ModalAbastoComponent,
    ReporteDeMediasComponent,
    BodyReporteMediasComponent,
    ComponenteReporteFaenaProveedorComponent,
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
    HttpClientModule,
    CalendarModule,
    DropdownModule,
    OrderListModule,
    TableModule,
    PaginatorModule,
    CardModule,
    TabViewModule
  ]
})
export class FaenaModule { }
