import { Component, Input, OnInit } from '@angular/core';
import { DataKosher } from '../../Interfaces/DataKosher.interface';
import { DataKosherAgrupada } from '../../Interfaces/DataKosherAgrupada.interface';

@Component({
  selector: 'total-show',
  templateUrl: './total-show.component.html',
  styleUrls: ['./total-show.component.css']
})
export class TotalShowComponent implements OnInit {
  @Input() datosKosher: DataKosher[] = [];
  @Input() titulo: string = '';
  @Input() totalPalletsCount: number = 0;
  
  dataAgrupada: DataKosherAgrupada[] = [];

  ngOnInit(): void {
    
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
