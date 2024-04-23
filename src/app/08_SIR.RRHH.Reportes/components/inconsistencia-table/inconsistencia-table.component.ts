import { Component, Input, OnDestroy, ViewChild } from '@angular/core';
import { HorasComparar } from '../../interfaces/HorasComparar.interface';
import { Table } from 'primeng/table';
import { Marcas } from '../../interfaces/Marcas.interface';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { MessageService } from 'primeng/api';
import { MarcasViewerComponent } from '../marcas-viewer/marcas-viewer.component';
import { DataMarcas } from '../../interfaces/DataMarcas.interface';


@Component({
  selector: 'inconsistencia-table',
  templateUrl: './inconsistencia-table.component.html',
  styleUrls: ['./inconsistencia-table.component.css'],
  providers: [DialogService, MessageService]
})
export class InconsistenciaTableComponent implements OnDestroy {
  @Input() data: HorasComparar[] = [];
  @ViewChild('dt2') dt2!: Table;
  @Input() marcas: Marcas[] = [];

  filteredValue: string = '';
  ref: DynamicDialogRef | undefined;

  constructor(
    public dialogService: DialogService,
    public messageService: MessageService
  ) {}

  ngOnDestroy(): void {
    if(this.ref) this.ref.close();
  }

  clearTable(table: Table) {
    table.clear();
    this.filteredValue = '';
  }

  applyFilter(event: Event) {
    const inp = document.getElementById('in') as HTMLInputElement;
    if(this.dt2){
      this.dt2.filterGlobal(this.filteredValue, 'contains')
    }
  }

  seleccionarTexto(event: FocusEvent): void {
    const inputElement = event.target as HTMLInputElement;
    inputElement.select();
  }

  verMarcas(nroFuncionario: string, event: MouseEvent) {
    const fila = (event.currentTarget as HTMLTableRowElement);
    const nombres = fila.cells[1].innerText;
    const apellidos = fila.cells[2].innerText;
    const regimen = fila.cells[9].innerText;
    const sector = fila.cells[10].innerText;
    
    const marcas: number[] | undefined = this.marcas.find(m => m.funcionario.toString() === nroFuncionario)?.marcas;

    if(marcas) {
      let m: DataMarcas = {
        nroFuncionario: nroFuncionario,
        nombres: nombres,
        apellidos: apellidos,
        regimen: regimen,
        sector: sector,
        marcas: marcas
      };

      this.openDialog(m);
    }
  }

  private openDialog(data: DataMarcas): void {
    this.ref = this.dialogService.open(MarcasViewerComponent, {
      data: data,
      header: `Marcas de ${data.nroFuncionario} ${data.nombres} ${data.apellidos}`,
      width: '40vw',
      contentStyle: { overflow: 'auto' },
      closeOnEscape: true,
      dismissableMask: true   
    })
  }
}
