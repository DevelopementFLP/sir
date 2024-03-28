import { Component } from '@angular/core';

@Component({
  selector: 'app-control-cuartos',
  templateUrl: './control-cuartos.component.html',
  styleUrls: ['./control-cuartos.component.css']
})
export class ControlCuartosComponent {
  fechaProduccion: Date | undefined;
  fechaProduccionDesde: Date | undefined;
  fechaProduccionHasta: Date | undefined;
}
