import { Component, Input, OnInit } from '@angular/core';
import { ReporteCuota } from '../../interfaces/ReporteCuota.interface';
import { LoteEntradaDTO } from '../../interfaces/LoteEntradaDTO.interface';
import { SalidaDTO } from '../../interfaces/SalidaDTO.interface';
import { EntradaDisplay } from '../../interfaces/EntradaDisplay.interface';
import { CommonCuotaService } from '../../services/common-cuota.service';
import { EntradaReporte } from '../../interfaces/EntradaReporte.interface';
import { EntradaDisplayReporte } from '../../interfaces/EntradaDisplayReporte.interface';
import { CortesReporte } from '../../interfaces/CortesReporte.interface';

@Component({
  selector: 'reporte-cuota-display',
  templateUrl: './reporte-cuota-display.component.html',
  styleUrls: ['./reporte-cuota-display.component.css']
})
export class ReporteCuotaDisplayComponent implements OnInit {

  @Input() reporte: ReporteCuota | undefined;

  entradaDelantero:         LoteEntradaDTO[]  = [];
  entradaTrasero:           LoteEntradaDTO[]  = [];
  entradaDesconocida:       LoteEntradaDTO[]  = [];
  cortesCuota:              SalidaDTO[]       = [];
  cortesNoCuota:            SalidaDTO[]       = [];
  cortesDelanterosNoCuota:  SalidaDTO[]       = [];
  cortesTraserosNoCuota:    SalidaDTO[]       = [];
  totalDelanteros:          EntradaDisplay[]  = [];
  totalTraseros:            EntradaDisplay[]  = [];

  cortesReporte!:           CortesReporte;  
  entradaReporte!:          EntradaReporte;
  totalEntradaPorTipo!:     EntradaDisplayReporte;
  
  rendimientoCortesCuota:   number = 0;
  rendimientoCortesNoCuota: number = 0;
  rendimientoCortesTotal:   number = 0;
  totalCajas:               number = 0;
  totalPesoCortes:          number = 0;
  totalPesoCortesCuota:     number = 0;
  totalPesoCortesNoCuota:   number = 0;

  pesoDelanteros:          number = 0;
  pesoTraseros:            number = 0;

  constructor(private utils: CommonCuotaService) {}

  ngOnInit(): void {
    this.entradaReporte           = this.utils.separarEntradaPorTipo(this.reporte);
    this.entradaDelantero         = this.entradaReporte.entradaDelantero;
    this.entradaTrasero           = this.entradaReporte.entradaTrasero;
    this.entradaDesconocida       = this.entradaReporte.entradaDesconocida;
    
    this.totalEntradaPorTipo      = this.utils.agruparEntrada(this.entradaDelantero, this.entradaTrasero);
    this.totalDelanteros          = this.totalEntradaPorTipo.delantero;
    this.totalTraseros            = this.totalEntradaPorTipo.trasero;

    this.cortesReporte            = this.utils.separarCortesPorTipo(this.reporte);
    this.cortesCuota              = this.cortesReporte.cuota;
    this.cortesNoCuota            = this.utils.combinarProductosIguales(this.cortesReporte.nocuota);
    
    
    this.cortesDelanterosNoCuota  = this.utils.combinarProductosIguales(this.cortesReporte.delanteroNoCuota);
    this.cortesTraserosNoCuota    = this.utils.combinarProductosIguales(this.cortesReporte.traseroNoCuota);

    this.totalPesoCortesCuota     = this.utils.totalPesoPorCortes(this.cortesCuota);
    this.totalPesoCortesNoCuota   = this.utils.totalPesoPorCortes(this.cortesNoCuota) + this.cortesReporte.manta[0].peso;
    this.rendimientoCortesCuota   = this.totalPesoCortesCuota / this.totalEntradaPorTipo.peso;
    this.rendimientoCortesNoCuota = this.totalPesoCortesNoCuota / this.totalEntradaPorTipo.peso;

    this.totalPesoCortes          = this.utils.totalPesoCajas(this.reporte?.cortes!);
    this.totalCajas               = this.utils.totalCajas(this.reporte?.cortes!);
    this.rendimientoCortesTotal   = this.totalPesoCortes / this.totalEntradaPorTipo.peso;

    this.totalDelanteros.forEach(del => {
      this.pesoDelanteros += del.peso;
    });

    this.totalTraseros.forEach(tra => {
      this.pesoTraseros += tra.peso;
    });
  }
}
