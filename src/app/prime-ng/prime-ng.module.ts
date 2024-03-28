import { NgModule } from '@angular/core';


import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { CheckboxModule } from 'primeng/checkbox';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { FieldsetModule } from 'primeng/fieldset';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { InputTextModule } from 'primeng/inputtext';
import { PanelMenuModule } from 'primeng/panelmenu';
import { TableModule } from 'primeng/table';
import { TabViewModule } from 'primeng/tabview';
import { CardModule } from 'primeng/card';


@NgModule({
  exports: [
    ButtonModule,
    CalendarModule,
    CheckboxModule,
    DialogModule,
    DropdownModule,
    FieldsetModule,
    InputTextareaModule,
    InputTextModule,
    PanelMenuModule,
    TableModule,
    TabViewModule,
    CardModule
  ]
})
export class PrimeNgModule { }
