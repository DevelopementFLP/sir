import { Component, Input } from '@angular/core';
import { Especie } from 'src/app/shared/models/gecos/haciendaLotes.interface';
import { Trazabilidad } from 'src/app/shared/models/trazabilidad.interface';

@Component({
  selector: 'info-traza',
  templateUrl: './traza.component.html',
  styleUrls: ['./traza.component.css']
})
export class TrazaComponent {

  @Input()
  public infoTraza?: Trazabilidad;

  public getEspecie( especie: Especie): string {
    return especie == Especie.B ? "VACUNO" : "OVINO";
  }

  public getImagen( especie: Especie ): string {
    return especie == Especie.B ? "../../../../assets/images/vaca.png" : "../../../../assets/images/oveja.png";
  }

}
