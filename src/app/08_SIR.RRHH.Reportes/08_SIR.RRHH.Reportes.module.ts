import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LogueoFuncComponent } from './pages/logueo-func/logueo-func.component';
import { LineaComponent } from './components/linea/linea.component';
import { FuncViewerComponent } from './components/func-viewer/func-viewer.component';



@NgModule({
  declarations: [
    LogueoFuncComponent,
    LineaComponent,
    FuncViewerComponent
  ],
  imports: [
    CommonModule
  ]
})
export class RRHHReportesModule { }
