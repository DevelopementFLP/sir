import { Component, HostListener, OnInit } from '@angular/core';
import { RRHHService } from '../../services/rrhh.service';
import { Empleado } from '../../interfaces/Empleado.interface';
import { HorarioEmpleado } from '../../interfaces/HorarioEmpleado.interface';
import { MessageService } from 'primeng/api';
import { formatDate } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { FuncionariosService } from '../../services/funcionarios.service';

@Component({
  selector: 'app-page-horario-funcionario',
  templateUrl: './page-horario-funcionario.component.html',
  styleUrls: ['./page-horario-funcionario.component.css'],
  providers: [MessageService],
})
export class PageHorarioFuncionarioComponent implements OnInit {
  nroFuncionario: string | null = '';
  nombreFuncionario: string | null = '';
  filteredData: Empleado[] = [];
  empleados: Empleado[] = [];
  fecha: Date | undefined;
  empleadoSeleccionado?: Empleado;
  horarios: HorarioEmpleado[] = [];
  empSelected!: Empleado;
  tiempoTotal: string = '';

  constructor(
    private rrhhService: RRHHService,
    private messageService: MessageService,
    private funcServie: FuncionariosService
  ) {}

  ngOnInit(): void {
    this.rrhhService.getEmpleados().subscribe((empl) => {
      this.empleados = empl;
    });

    this.funcServie.data$.subscribe((emp) => {
      if (emp != null) {
        this.empSelected = emp;
        if (emp) {
          const txtCodigo = document.getElementById('code') as HTMLInputElement;
          const txtNombre = document.getElementById('name') as HTMLInputElement;
          txtCodigo.value = emp.code;
          txtNombre.value = emp.name;
          this.empleadoSeleccionado = emp;
          this.filteredData = [];
        }
      }
    });
  }

  filterData(codeFilter: string, nameFilter: string) {
    this.empleadoSeleccionado = undefined;
    if (!codeFilter && !nameFilter) {
      this.filteredData = [];
    } else {
      this.filteredData = this.empleados.filter(
        (item) =>
          (!codeFilter ||
            item.code.toLowerCase().includes(codeFilter.toLowerCase())) &&
          (!nameFilter ||
            item.name.toLowerCase().includes(nameFilter.toLowerCase()))
      );
    }
  }

  onSelectEmpleado(event: any): void {
    const empleadoSeleccionado: Empleado = event.value;
    this.empSelected = empleadoSeleccionado;
    if (empleadoSeleccionado) {
      const txtCodigo = document.getElementById('code') as HTMLInputElement;
      const txtNombre = document.getElementById('name') as HTMLInputElement;
      txtCodigo.value = empleadoSeleccionado.code;
      txtNombre.value = empleadoSeleccionado.name;
      this.filteredData = [];
    }
  }

  buscarHorario(): void {
    const txtCodigo = document.getElementById('code') as HTMLInputElement;
    if (txtCodigo.value === '') return;
    if (!this.validarFecha()) {
      this.mostrarErrorFecha();
      return;
    }

    this.rrhhService
      .getHorarioFuncionarioPorFecha(this.fecha!, txtCodigo.value)
      .subscribe((horas) => {
        this.horarios = horas;
        this.tiempoTotal = this.funcServie.getTiempoTotal(this.horarios);
      });
  }

 

  private validarFecha(): boolean {
    return this.fecha !== undefined;
  }

  private mostrarErrorFecha(): void {
    this.messageService.add({
      severity: 'custom-error',
      summary: 'Error',
      detail: 'Debes ingresar una fecha válida.',
    });
  }

  infoEmpleado(): string {
    return this.empSelected.code + ' ' + this.empSelected.name;
  }

  formatearFecha(fecha: Date): string {
    return formatDate(fecha, 'dd/MM/yyyy', 'es-UY)');
  }

  seleccionarTexto(event: FocusEvent): void {
    const inputElement = event.target as HTMLInputElement;
    inputElement.select();
  }


  borrarDatos(): void {
    this.filteredData = [];
      this.empleadoSeleccionado = undefined;
      const txtCodigo = document.getElementById('code') as HTMLInputElement;
      const txtNombre = document.getElementById('name') as HTMLInputElement;

      txtCodigo.value = '';
      txtNombre.value = '';

      txtCodigo.focus()
  }
}
