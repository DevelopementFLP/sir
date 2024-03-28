import { Component } from '@angular/core';

@Component({
  selector: 'app-informe-kosher-gal',
  templateUrl: './informe-kosher-gal.component.html',
  styleUrls: ['./informe-kosher-gal.component.css']
})
export class InformeKosherGalComponent {

  fechaProduccion: Date | undefined;
  fechaProduccionDesde: Date | undefined;
  fechaProduccionHasta: Date | undefined;

}
