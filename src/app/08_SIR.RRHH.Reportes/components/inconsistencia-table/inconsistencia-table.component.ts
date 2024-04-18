import { Component, Input, ViewChild } from '@angular/core';
import { HorasComparar } from '../../interfaces/HorasComparar.interface';
import { Table } from 'primeng/table';

@Component({
  selector: 'inconsistencia-table',
  templateUrl: './inconsistencia-table.component.html',
  styleUrls: ['./inconsistencia-table.component.css']
})
export class InconsistenciaTableComponent {
  @Input() data: HorasComparar[] = [];
  @ViewChild('dt2') dt2!: Table;

  filteredValue: string = '';

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
}
