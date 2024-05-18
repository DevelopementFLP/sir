import { Component, OnInit } from '@angular/core';
import { LoteEntrada } from '../../interfaces/LoteEntrada.interface';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-lotes-entrada',
  templateUrl: './lotes-entrada.component.html',
  styleUrls: ['./lotes-entrada.component.css']
})
export class LotesEntradaComponent implements OnInit {
  lotesEntrada!: LoteEntrada[];
  cantCuartos: number = 0;
  cantKilos: number = 0;
  promedioKilos: number = 0;

  constructor(public config: DynamicDialogConfig) {}

  ngOnInit(): void {
    if(this.config) {
    this.lotesEntrada = this.config.data.lotes;
    this.cantCuartos = this.totalCuartos();
    this.cantKilos = this.totalKilos();
    this.promedioKilos = this.cantKilos / this.cantCuartos;
  
    }
  }

  totalCuartos(): number {
    const cuartos = this.lotesEntrada.reduce((total, cuarto) => {
      return total + cuarto.cuartos;
    }, 0);

    return cuartos;
  }

  totalKilos(): number {
    const kilos = this.lotesEntrada.reduce((total, cuarto) => {
      return total + cuarto.pesoCuartos;
    }, 0);

    return kilos;
  }
}
