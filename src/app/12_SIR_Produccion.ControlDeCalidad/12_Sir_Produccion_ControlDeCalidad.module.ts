import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImageModule } from 'primeng/image';
import { CardModule } from 'primeng/card';
import { TooltipModule } from 'primeng/tooltip';
import { TableModule } from 'primeng/table';
import { MatGridListModule } from '@angular/material/grid-list';
import { ComponentePaginaPrincipalIncidentesComponent } from './components/componente-pagina-principal-incidentes/componente-pagina-principal-incidentes.component';
import { PaginaPrincipalIncidentesComponent } from './pages/pagina-principal-incidentes/pagina-principal-incidentes.component';
import { ButtonModule } from 'primeng/button';

import { DialogModule } from 'primeng/dialog';

import { AccordionModule } from 'primeng/accordion';
import { CalendarModule } from 'primeng/calendar';
import { FormsModule } from '@angular/forms';
import { ProduccionFichaTecnicaModule } from '../11_SIR_Produccion.Ficha.Tecnica/11_SIR_Produccion.Ficha.Tecnica.module';


@NgModule({
  declarations: [
    ComponentePaginaPrincipalIncidentesComponent,
    PaginaPrincipalIncidentesComponent
  ],
  exports: [
    ComponentePaginaPrincipalIncidentesComponent,
    PaginaPrincipalIncidentesComponent
  ],
  imports: [
    CommonModule,
    ImageModule, 
    CardModule,
    TooltipModule,
    TableModule,
    MatGridListModule,
    DialogModule,
    ButtonModule,
    AccordionModule,
    CalendarModule,
    FormsModule,
    ProduccionFichaTecnicaModule
  ]
})
export class ProduccionControlDeCalidadModule { }
