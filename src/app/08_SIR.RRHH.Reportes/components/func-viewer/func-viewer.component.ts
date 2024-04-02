import { Component, Input, OnDestroy } from '@angular/core';
import { Funcionario } from '../../interfaces/Funcionario.interface';
import { HorarioEmpleado } from '../../interfaces/HorarioEmpleado.interface';
import { RRHHService } from '../../services/rrhh.service';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { MessageService } from 'primeng/api';
import { HorarioFuncionarioComponent } from '../horario-funcionario/horario-funcionario.component';
import { formatDate } from '@angular/common';
import { ExportacionComponent } from 'src/app/shared/exportacion/exportacion.component';

@Component({
  selector: 'rrhh-func-viewer',
  templateUrl: './func-viewer.component.html',
  styleUrls: ['./func-viewer.component.css'],
  providers: [DialogService, MessageService]
})
export class FuncViewerComponent implements OnDestroy {
  @Input() funcionarios: Funcionario[] = []
  ref: DynamicDialogRef | undefined;

  constructor(
    public dialogService: DialogService,
    public messageService: MessageService ) {}

  mostrarHorarioLogueo(numeroFunc: string, nombre: string): void {
    this.openDialog(numeroFunc, nombre);
  }

  private openDialog(numeroFunc: string, nombreEmpleado: string): void {
    this.ref = this.dialogService.open(HorarioFuncionarioComponent, {
      data: {
        numeroFunc: numeroFunc,
        nombreFunc: nombreEmpleado,
        visor: true
      },
      header: `Logueos de ${numeroFunc} - ${nombreEmpleado} del día ${formatDate(new Date(), "dd/MM/yyyy", "es-UY)")}`,
      width: '50vw',
      contentStyle: { overflow: 'auto' },
      closeOnEscape: true,
      dismissableMask: true   
    })
  }

  ngOnDestroy(): void {
    if(this.ref) this.ref.close();
  }
}
