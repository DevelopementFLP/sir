import { Component, OnInit } from '@angular/core';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { DataMarcas } from '../../interfaces/DataMarcas.interface';
import { ControlHorasService } from '../../services/control-horas.service';

@Component({
  selector: 'app-marcas-viewer',
  templateUrl: './marcas-viewer.component.html',
  styleUrls: ['./marcas-viewer.component.css']
})
export class MarcasViewerComponent implements OnInit {
  dataFunc!: DataMarcas;

  constructor(
    public config: DynamicDialogConfig,
    public controlHorasService: ControlHorasService
  ) {}

  ngOnInit(): void {
    this.dataFunc = this.config.data;
  }

  convertirAHora(hora: any): string {
    if(isNaN(hora)) return hora;

    const fecha = this.controlHorasService.convertirDecimalAHora(hora);

    fecha.setHours(fecha.getHours() + 3);

    const horaFormateada = new Intl.DateTimeFormat('es-ES', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: false
      }).format(fecha);

    return horaFormateada;
  }

  esError(data: any): boolean {
    return isNaN(data);
  }
}
