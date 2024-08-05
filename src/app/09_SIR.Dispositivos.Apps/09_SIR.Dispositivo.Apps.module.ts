import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'primeng/api';
import { DispositvosComponent } from './layout/Formularios/Dispositvos/dispositvos.component';
import { ModalDispositivoComponent } from './modales/modal-dispositivo/modal-dispositivo.component';

import { ReactiveFormsModule,FormsModule } from '@angular/forms';

//Componentes de angular material
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select'
import { MatProgressBarModule } from '@angular/material/progress-bar'; 
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatGridListModule } from '@angular/material/grid-list';

import { LayoutModule } from '@angular/cdk/layout'; 
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav'; 
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon'; 
import { MatListModule } from '@angular/material/list'; 

import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator'; 
import { MatDialogModule } from '@angular/material/dialog'; 
import { MatSnackBarModule } from '@angular/material/snack-bar'; 
import { MatTooltipModule } from '@angular/material/tooltip'; 
import { MatAutocompleteModule } from '@angular/material/autocomplete'; 
import { MatDatepickerModule } from '@angular/material/datepicker'; 

import { MatNativeDateModule } from '@angular/material/core';
import { UbicacionesComponent } from './layout/Formularios/Ubicaciones/ubicaciones.component';
import { ModalUbicacionComponent } from './modales/modal-Ubicacion/modal-ubicacion.component';
import { FormatosComponent } from './layout/Formularios/Formatos/formatos.component';
import { TiposDispositivosComponent } from './layout/Formularios/TiposDispositivos/tipos-dispositivos.component';
import { ModalformatoComponent } from './modales/modal-Formato/modalformato.component';
import { ModalTipoDispositivoComponent } from './modales/modal-tipoDispositivo/modal-tipo-dispositivo.component'; 

import { LecturasDispositivosComponent } from './layout/Reportes/LecturasDispositivos/lecturas-dispositivos.component';

//Primeng Tabla
import { TabViewModule } from 'primeng/tabview';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextareaModule } from 'primeng/inputtextarea';

@NgModule({
  declarations: [      
    DispositvosComponent,
    ModalDispositivoComponent,
    UbicacionesComponent,
    ModalUbicacionComponent,
    FormatosComponent,
    TiposDispositivosComponent,
    ModalTipoDispositivoComponent,
    ModalformatoComponent,
    LecturasDispositivosComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    MatCardModule,
    CommonModule,
    MatCardModule,
    MatInputModule,
    MatSelectModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatGridListModule,
    LayoutModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatTableModule,
    MatPaginatorModule,
    MatDialogModule,
    MatSnackBarModule,
    MatTooltipModule,
    MatAutocompleteModule,
    MatDatepickerModule,
    MatNativeDateModule,
    ReactiveFormsModule,
    FormsModule,
    TabViewModule,
    TableModule,
    InputTextModule,
    ButtonModule,
    DropdownModule,
    InputTextareaModule
  ],
  providers:[
    MatDatepickerModule,
    MatNativeDateModule
  ]
})
export class DispositivoModule { }
