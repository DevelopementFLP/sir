import { Component, OnInit } from '@angular/core';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { ProductosPorEstacion } from '../../interfaces/ProductosPorEstacion.interface';

@Component({
  selector: 'app-cortes-por-estacion',
  templateUrl: './cortes-por-estacion.component.html',
  styleUrls: ['./cortes-por-estacion.component.css']
})
export class CortesPorEstacionComponent implements OnInit {

  constructor(private dialogConfig: DynamicDialogConfig) {}

  cortesPuesto!: ProductosPorEstacion[];

  ngOnInit(): void {
    if(this.dialogConfig) {
      this.cortesPuesto = this.dialogConfig.data.productos;
    }
  }

  getTotalByProperty(propiedad: keyof ProductosPorEstacion): number {
    let total = 0;

    total = this.cortesPuesto.reduce((total, estacion) => {
      return total + (estacion && estacion[propiedad] ? estacion[propiedad] as number : 0);
    }, 0);

    return total;
  }

}
