import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LogueoFuncComponent } from './pages/logueo-func/logueo-func.component';
import { LineaComponent } from './components/linea/linea.component';
import { FuncViewerComponent } from './components/func-viewer/func-viewer.component';
import { PrimeNgModule } from '../prime-ng/prime-ng.module';
import { HorarioFuncionarioComponent } from './components/horario-funcionario/horario-funcionario.component';
import { PageHorarioFuncionarioComponent } from './components/page-horario-funcionario/page-horario-funcionario.component';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';




@NgModule({
  declarations: [
    LogueoFuncComponent,
    LineaComponent,
    FuncViewerComponent,
    HorarioFuncionarioComponent,
    PageHorarioFuncionarioComponent
  ],
  imports: [
    CommonModule,
    PrimeNgModule,
    FormsModule,
    SharedModule
  ]
})
export class RRHHReportesModule { }
