import { Component, Input } from '@angular/core';
import { EstacionesCortesCajas } from '../../interfaces/EstacionesCortesCajas.interface';

@Component({
  selector: 'puesto-estacion',
  templateUrl: './puesto-estacion.component.html',
  styleUrls: ['./puesto-estacion.component.css']
})
export class PuestoEstacionComponent {
  @Input() nroPuesto: number = 0;
  @Input() titulo: string = 'S';
  @Input() cajas: number = 0;
  @Input() kilos: number = 0;
  @Input() data: EstacionesCortesCajas | undefined;
}
