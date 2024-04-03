import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";

import { AppRoutingModule } from "../app-routing.module";

import { LoginComponent } from './login/login.component';
import { MaterialThemeModule } from "../MaterialTheme/MaterialTheme.module";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PrimeNgModule } from "../prime-ng/prime-ng.module";

@NgModule({
    declarations : [
        LoginComponent,
    ],
    exports: [
        LoginComponent,
    ],
    imports: [
        CommonModule,
        MaterialThemeModule,
        FormsModule,
        ReactiveFormsModule,
        AppRoutingModule,
        PrimeNgModule
    ]
})
export class ControlUsuariosModule {

}