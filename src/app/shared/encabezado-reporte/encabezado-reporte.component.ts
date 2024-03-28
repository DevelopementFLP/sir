import { Component, Input } from '@angular/core';

@Component({
  selector: 'shared-encabezado-reporte',
  templateUrl: './encabezado-reporte.component.html',
  styleUrls: ['./encabezado-reporte.component.css']
})
export class EncabezadoReporteComponent {

  @Input()
  public tituloReporte: string = "";
}
