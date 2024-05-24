import { Component, Input, OnDestroy } from '@angular/core';
import { Funcionario } from '../../interfaces/Funcionario.interface';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { MessageService } from 'primeng/api';
import { HorarioFuncionarioComponent } from '../horario-funcionario/horario-funcionario.component';
import { formatDate } from '@angular/common';
import { LoginHistorico } from '../../interfaces/LoginHistorico.interface';


@Component({
  selector: 'rrhh-func-viewer',
  templateUrl: './func-viewer.component.html',
  styleUrls: ['./func-viewer.component.css'],
  providers: [DialogService, MessageService]
})
export class FuncViewerComponent implements OnDestroy {
  @Input() funcionarios: Funcionario[] = []
  @Input() funcionariosHistorico: LoginHistorico[] = [];
  @Input() timeType: string = '';
  @Input() fecha!: Date;

  ref: DynamicDialogRef | undefined;

  constructor(
    public dialogService: DialogService,
    public messageService: MessageService ) {}

  mostrarHorarioLogueo(numeroFunc: string, nombre: string): void {
    this.openDialog(numeroFunc, nombre);
  }

  acortarNombre(nombre: string) : string {
    let n: string = '';
    const parts: string[] = nombre.split(" ");
    const name: string = parts[parts.length - 1].substring(0,1) + ".";

    for(let i = 0; i < parts.length - 1; i++) {
      n = n + parts[i] + " ";
    }

    return n + name;
  }

  private openDialog(numeroFunc: string, nombreEmpleado: string): void {
    this.ref = this.dialogService.open(HorarioFuncionarioComponent, {
      data: {
        numeroFunc: numeroFunc,
        nombreFunc: nombreEmpleado,
        fecha: this.fecha,
        visor: true
      },
      header: `Logueos de ${numeroFunc} - ${nombreEmpleado} del día ${formatDate(this.fecha, "dd/MM/yyyy", "es-UY)")}`,
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
