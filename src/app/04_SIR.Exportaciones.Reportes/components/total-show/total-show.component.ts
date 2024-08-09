import { Component, Input } from '@angular/core';
import { DataKosher } from '../../Interfaces/DataKosher.interface';

@Component({
  selector: 'total-show',
  templateUrl: './total-show.component.html',
  styleUrls: ['./total-show.component.css']
})
export class TotalShowComponent {
  @Input() datosKosher: DataKosher[] = [];
  @Input() titulo: string = '';

  totalPallets(): number {
    const pallets = Array.from(new Set(this.datosKosher.map(d => d.idPallet)));
    return pallets.length;
  }

  totalKilosNetos(): number {
    var kilos: number = 0;
    this.datosKosher.forEach(d => {
      kilos += d.pesoNeto!;
    });
    return kilos;
  }

  totalKilosBrutos(): number {
    var kilos: number = 0;
    this.datosKosher.forEach(d => {
      kilos += d.pesoBruto!;
    });
    return kilos;
  }

  totalPrecio(): number {
    var precio: number = 0;

    this.datosKosher.forEach(d => {
      precio += d.pesoNeto! * (d.precioTonelada / 1000);
    });

    return precio;
  }

}
