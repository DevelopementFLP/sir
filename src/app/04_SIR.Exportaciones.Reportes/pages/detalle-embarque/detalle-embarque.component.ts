import { Component } from '@angular/core';

@Component({
  selector: 'app-detalle-embarque',
  templateUrl: './detalle-embarque.component.html',
  styleUrls: ['./detalle-embarque.component.css']
})
export class DetalleEmbarqueComponent {
  fechaDesde: Date | undefined;
  fechaHasta: Date | undefined;
}
