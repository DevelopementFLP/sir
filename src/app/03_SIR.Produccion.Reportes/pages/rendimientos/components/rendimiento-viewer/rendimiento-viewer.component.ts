import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { CorteLote } from '../../interfaces/CorteLote.interface';
import { DataRendimiento } from '../../interfaces/DataRendimiento.interface';

import { CommonService } from '../../services/common.service';

@Component({
  selector: 'rendimiento-viewer',
  templateUrl: './rendimiento-viewer.component.html',
  styleUrls: ['./rendimiento-viewer.component.css']
})
export class RendimientoViewerComponent implements OnInit, OnChanges {

  @Input() data:    CorteLote[]       = [];
  @Input() fechas:  Date[]            = [];

  rendimientos:     DataRendimiento[] = [];

  constructor(private cmnSrvc: CommonService) {}

  ngOnInit(): void {
   this.processData();
  }

  ngOnChanges(changes: SimpleChanges): void {    
    if ((changes['data'] && changes['data'].currentValue && !changes['data'].firstChange) || (changes['fechas'] && changes['fechas'].currentValue && !changes['fechas'].firstChange) ) {
      this.processData();
    }
  }

  private processData(): void {
    this.rendimientos = [];
    this.fechas.forEach(f => {
      const entrada = this.data[0].entrada.filter(e => this.cmnSrvc.sonFechasIguales(e.fecha, f));
      if(entrada.length > 0) {
        const cortes  = this.data[0].cortes.filter(c => this.cmnSrvc.sonFechasIguales(c.fecha, f));
        let entr = this.cmnSrvc.agruparEntrada(entrada);
        let cts = this.cmnSrvc.agruparCortes(cortes);
        this.rendimientos.push({
          fecha: f,
          entrada: entr,
          cortes: cts,
          totalCuartos: this.cmnSrvc.cantidadTotalCuartos(entr),
          pesoCuartos: this.cmnSrvc.pesoTotalCuartos(entr),
          totalCortes: this.cmnSrvc.cantidadTotalCortes(cts),
          pesoCortes: this.cmnSrvc.pesoTotalCortes(cts)
        });  
      }
    });
  }

}
