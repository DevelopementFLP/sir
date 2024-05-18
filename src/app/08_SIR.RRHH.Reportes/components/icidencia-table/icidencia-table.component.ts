import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Table } from 'primeng/table';
import { Incidencia } from '../../interfaces/Incidencia.interface';
import { IncidenciaAgrupada } from '../../interfaces/IncidenciaAgrupada.interface';
import { MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { DataMarcas } from '../../interfaces/DataMarcas.interface';
import { MarcasViewerComponent } from '../marcas-viewer/marcas-viewer.component';
import { Marcas } from '../../interfaces/Marcas.interface';
import { HorasPorFuncionario } from '../../interfaces/HorasPorFuncionario.interface';
import { HorasTrabajadas } from '../../interfaces/HorasTrabajadas.interface';
import { MarcasViewerData } from '../../interfaces/MarcasViewerData.interface';

@Component({
  selector: 'incidencia-table',
  templateUrl: './icidencia-table.component.html',
  styleUrls: ['./icidencia-table.component.css'],
  providers: [DialogService, MessageService]
})
export class IncidenciaTableComponent implements OnInit, OnDestroy {

  @Input() data!: Incidencia[];
  @ViewChild('dt1', { static: false }) dt1: Table | undefined;
  searchText: string = '';
  motivos: string[] = [];
  incidenciasAgrupadas: IncidenciaAgrupada[] = []
  ref: DynamicDialogRef | undefined;
  globalFilter: string = '';
  @Input() marcas: Marcas[] = [];
  @Input() horasPorCodigo: HorasPorFuncionario[] = [];

  constructor(
    public dialogService: DialogService,
    public messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.motivos = Array.from(new Set(this.data.map(i => i.motivo)));
    this.motivos.sort((a, b) => {
      if(a < b) return -1;
        if(a > b) return 1;
        return 0;
    });

    this.motivos.forEach(motivo => {
      const funcionariosFiltrados: Incidencia[] = this.data.filter(d => d.motivo === motivo);
      this.incidenciasAgrupadas.push({
        motivo: motivo,
        funcionarios: funcionariosFiltrados.filter(f => f.motivo === motivo)
      });
     
      this.incidenciasAgrupadas.sort((a, b) => {
        if(a.motivo < b.motivo) return -1;
        if(a.motivo > b.motivo) return 1;
        return 0;
      });
    });
  }

  ngOnDestroy(): void {
    if(this.ref) this.ref.close();
  }

  applyGlobalFilter(event: Event) {
    if (this.dt1) {
      this.globalFilter = (event.target as HTMLInputElement).value;
      this.dt1.filterGlobal(this.globalFilter, 'contains')
    }
  }

  clearTable(table: Table) {
    table.clear();
    this.globalFilter = '';
    const inp = document.getElementById('in') as HTMLInputElement;
    inp.value = '';
  }

  getSeverity(status: string) {
    switch (status) {
        case 'Error en formato de marca':
            return 'danger';
        case 'Falta alguna marca':
            return 'warning';
        case 'Funcionario no está en padrón':
            return 'info';
        default:
            return '';
    }
  }

  totalPorMotivo(motivo: string): number {
    return this.incidenciasAgrupadas[this.motivos.indexOf(motivo)].funcionarios.length;
  }

  seleccionarTexto(event: FocusEvent): void {
    const inputElement = event.target as HTMLInputElement;
    inputElement.select();
  }

  verMarcas(nroFuncionario: string, event: MouseEvent) {
    const fila = (event.currentTarget as HTMLTableRowElement);
    const nombres = fila.cells[1].innerText;
    const apellidos = fila.cells[2].innerText;
    const regimen = fila.cells[3].innerText;
    const sector = fila.cells[4].innerText;
    
    const marcas: number[] | undefined = this.marcas.find(m => m.funcionario.toString() === nroFuncionario)?.marcas;
    const horasCodigo: HorasTrabajadas[] | undefined = this.horasPorCodigo.find(h => h.nroFuncionario.toString() === nroFuncionario)?.horas;

    if(marcas && horasCodigo) {
      let m: DataMarcas = {
        nroFuncionario: nroFuncionario,
        nombres: nombres,
        apellidos: apellidos,
        regimen: regimen,
        sector: sector,
        marcas: marcas
      };

      const data: MarcasViewerData = {
        dataMarcas: m,
        horasTrabajadas: horasCodigo
      }

      this.openDialog(data);
    }
  }

  private openDialog(data: MarcasViewerData): void {
    this.ref = this.dialogService.open(MarcasViewerComponent, {
      data: data,
      header: `Marcas de ${data.dataMarcas.nroFuncionario} ${data.dataMarcas.nombres} ${data.dataMarcas.apellidos}`,
      width: '40vw',
      contentStyle: { overflow: 'auto' },
      closeOnEscape: true,
      dismissableMask: true   
    })
  }
}
