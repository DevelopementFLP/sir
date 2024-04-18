import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Table } from 'primeng/table';
import { Incidencia } from '../../interfaces/Incidencia.interface';
import { IncidenciaAgrupada } from '../../interfaces/IncidenciaAgrupada.interface';

@Component({
  selector: 'incidencia-table',
  templateUrl: './icidencia-table.component.html',
  styleUrls: ['./icidencia-table.component.css']
})
export class IncidenciaTableComponent implements OnInit {

  @Input() data!: Incidencia[];
  @ViewChild('dt1', { static: false }) dt1: Table | undefined;
  searchText: string = '';
  motivos: string[] = [];
  incidenciasAgrupadas: IncidenciaAgrupada[] = []
  
  globalFilter: string = '';

  constructor() {}

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
    console.log(this.incidenciasAgrupadas)
  }

  applyGlobalFilter(event: Event) {
    if (this.dt1) {
      this.globalFilter = (event.target as HTMLInputElement).value;
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
        default:
            return '';
    }
  }

  totalPorMotivo(motivo: string): number {
    return this.incidenciasAgrupadas[this.motivos.indexOf(motivo)].funcionarios.length;
  }
}
