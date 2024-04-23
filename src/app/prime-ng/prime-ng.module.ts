import { NgModule } from '@angular/core';


import { AccordionModule } from 'primeng/accordion';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { CardModule } from 'primeng/card';
import { CheckboxModule } from 'primeng/checkbox';
import { ChipModule } from 'primeng/chip';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { FieldsetModule } from 'primeng/fieldset';
import { FileUploadModule } from 'primeng/fileupload';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { InputTextModule } from 'primeng/inputtext';
import { ListboxModule } from 'primeng/listbox';
import { PanelMenuModule } from 'primeng/panelmenu';
import { PasswordModule } from 'primeng/password';
import { SidebarModule } from 'primeng/sidebar';
import { TableModule } from 'primeng/table';
import { TabViewModule } from 'primeng/tabview';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';

@NgModule({
  exports: [
    AccordionModule,
    BadgeModule,
    ButtonModule,
    CalendarModule,
    CardModule,
    CheckboxModule,
    ChipModule,
    ConfirmDialogModule,
    DialogModule,
    DropdownModule,
    DynamicDialogModule,
    FieldsetModule,
    FileUploadModule,
    InputTextareaModule,
    InputTextModule,
    ListboxModule,
    PanelMenuModule,
    PasswordModule,
    SidebarModule,
    TableModule,
    TabViewModule,
    TagModule,
    ToastModule,
    TooltipModule,
    ]
})
export class PrimeNgModule { }
