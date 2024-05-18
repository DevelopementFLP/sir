import { Component, Input, OnInit } from '@angular/core';
import { IndicadorHuesero } from '../../interfaces/IndicadorHuesero.interface';
import { IndicadorCharqueador } from '../../interfaces/IndicadorCharqueador.interface';
import { IndicadorEmpaque } from '../../interfaces/IndicadorEmpaque.interface';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-data-line-viewer',
  templateUrl: './data-line-viewer.component.html',
  styleUrls: ['./data-line-viewer.component.css']
})
export class DataLineViewerComponent implements OnInit {
  @Input() hueseros: (IndicadorHuesero | undefined)[] = []
  @Input() charqueadores: (IndicadorCharqueador | undefined)[] = []
  @Input() empaque: (IndicadorEmpaque | undefined)[] = []

  constructor(private config: DynamicDialogConfig) {}

  ngOnInit(): void {
    if(this.config) {
      this.hueseros = this.config.data.hueseros;
      this.charqueadores = this.config.data.charqueadores;
      this.empaque = this.config.data.empaque;
    }
  }

  getTotalPropiedadHuesero(propiedad: keyof IndicadorHuesero): number {
    let total: number = 0;
    total = this.hueseros.reduce((total, huesero) => {
      return total + (huesero && huesero[propiedad] ? huesero[propiedad] as number : 0);

    }, 0);
    return total
  }

  getRendimientoHueseros(): number {
    return (this.getTotalPropiedadHuesero('kgEnviados') / this.getTotalPropiedadHuesero('kgRecibidos')) ?? 0;
  }

  getTotalPropiedadCharquedor(propiedad: keyof IndicadorCharqueador): number {
    let total: number = 0;

    total = this.charqueadores.reduce((total, charqueador) => {
      return total + (charqueador && charqueador[propiedad] ? charqueador[propiedad] as number : 0);
    }, 0);

    return total;
  }

  getRendimientoCharqueadores(): number {
    return (this.getTotalPropiedadCharquedor('kgEnviados') / this.getTotalPropiedadCharquedor('kgRecibidos')) ?? 0;
  }

  trimNombrePuesto(nombrePuesto: string): string {
    const partes: string[] = nombrePuesto.split(' ');
    let puesto: string = partes[1].substring(0,1);

    if(partes.length == 4) {
      puesto += partes[2].substring(0,1);
    }

    return partes[0] + "..." + partes[partes.length - 1];
  }

  getTotalPropiedadEmpaque(propiedad: keyof IndicadorEmpaque): number {
    let total: number = 0;

    total = this.empaque.reduce((total, pack) => {
      return total + (pack && pack[propiedad] ? pack[propiedad] as number : 0);
    }, 0);
    return total;
  }
}
