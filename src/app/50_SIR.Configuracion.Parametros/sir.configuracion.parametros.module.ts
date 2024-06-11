import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfiguracionMainPageComponent } from './pages/configuracion-main-page/configuracion-main-page.component';
import { CardConfigurationComponent } from './components/card-configuration/card-configuration.component';
import { PrimeNgModule } from '../prime-ng/prime-ng.module';



@NgModule({
  declarations: [
    ConfiguracionMainPageComponent,
    CardConfigurationComponent
  ],
  imports: [
    CommonModule,
    PrimeNgModule
  ],
  exports: [
    CardConfigurationComponent
  ]
})
export class SIRConfiguracionParametrosModule { }
