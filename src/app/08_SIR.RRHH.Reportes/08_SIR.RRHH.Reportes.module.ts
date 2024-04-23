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
import { ControlHorasComponent } from './pages/control-horas/control-horas.component';
import { SingleFileUploaderComponent } from './components/single-file-uploader/single-file-uploader.component';
import { IncidenciaTableComponent } from './components/icidencia-table/icidencia-table.component';
import { CustomFilter } from './pipes/CustomFilterPipe.pipe';
import { InconsistenciaTableComponent } from './components/inconsistencia-table/inconsistencia-table.component';
import { MarcasViewerComponent } from './components/marcas-viewer/marcas-viewer.component';




@NgModule({
  declarations: [
    LogueoFuncComponent,
    LineaComponent,
    FuncViewerComponent,
    HorarioFuncionarioComponent,
    PageHorarioFuncionarioComponent,
    ControlHorasComponent,
    SingleFileUploaderComponent,
    IncidenciaTableComponent,
    CustomFilter,
    InconsistenciaTableComponent,
    MarcasViewerComponent
  ],
  imports: [
    CommonModule,
    PrimeNgModule,
    FormsModule,
    SharedModule
  ]
})
export class RRHHReportesModule { }
