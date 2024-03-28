import { Component } from '@angular/core';

@Component({
  selector: 'app-informe-kosher-usa',
  templateUrl: './informe-kosher-usa.component.html',
  styleUrls: ['./informe-kosher-usa.component.css']
})
export class InformeKosherUsaComponent {
  fechaProduccion: Date | undefined;
  fechaProduccionDesde: Date | undefined;
  fechaProduccionHasta: Date | undefined;
}
