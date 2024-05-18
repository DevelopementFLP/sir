import { Component, OnInit } from '@angular/core';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { IndicadorCharqueador } from '../../interfaces/IndicadorCharqueador.interface';
import { IndicadorHuesero } from '../../interfaces/IndicadorHuesero.interface';

@Component({
  selector: 'app-detalle-hueseros',
  templateUrl: './detalle-hueseros.component.html',
  styleUrls: ['./detalle-hueseros.component.css']
})
export class DetalleHueserosComponent implements OnInit {

  constructor(private config: DynamicDialogConfig) {}

  detalleHueseros: IndicadorHuesero[] = [];
  totalCuartos: number = 0;
  totalKilosRecibidos: number = 0;
  totalKilosEnviados: number = 0;
  rendPromedio: number = 0;


  ngOnInit(): void {
    if(this.config) {
      this.detalleHueseros = this.config.data.hueseros;
      this.totalCuartos = this.cuartos();
      this.totalKilosRecibidos = this.kilosRecibidos();
      this.totalKilosEnviados = this.kilosEnviados();
      this.rendPromedio = this.totalKilosEnviados / this.totalKilosRecibidos * 100;
    }

  }

  
  cuartos(): number {
    const cuartos = this.detalleHueseros.reduce((total, detalle) => {
      return total + detalle.cuartos;
    }, 0);

    return cuartos;
  }

  kilosRecibidos(): number {
    const kilos = this.detalleHueseros.reduce((total, detalle) => {
      return total + detalle.kgRecibidos;
    }, 0);

    return kilos;
  }

  kilosEnviados(): number {
    const kilos = this.detalleHueseros.reduce((total, detalle) => {
      return total + detalle.kgEnviados;
    }, 0);

    return kilos;
  }

}
