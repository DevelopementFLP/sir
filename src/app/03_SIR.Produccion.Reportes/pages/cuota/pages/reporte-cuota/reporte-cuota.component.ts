import { Component, OnInit } from '@angular/core';
import { formatDate } from '@angular/common';
import { lastValueFrom } from 'rxjs';

import { CommonCuotaService } from '../../services/common-cuota.service';
import { Comparativo } from '../../interfaces/Comparativo.inteface';
import { ComparativoDict } from '../../interfaces/ComprativoDict.interface';
import { ComparativoReporte } from '../../interfaces/ComparativoReporte.interface';
import { ConfReporteCuotaDTO } from '../../interfaces/ConfReporteCuotaDTO.interface';
import { ConfTipoCuotaDTO } from '../../interfaces/ConfTipoCuotaDTO.interface';
import { CuotaService } from '../../services/cuota.service';
import { DWCaja } from '../../interfaces/DWCaja.interface';
import { DWCajaSalidaDTO } from '../../interfaces/DWCajaSalidaDTO.interface';
import { DWCorte } from '../../interfaces/DWCorte.interface';
import { DWEntrada } from '../../interfaces/DWEntrada.interface';
import { DWSalidaDTO } from '../../interfaces/DWSalidaDTO.interface';
import { LoteDTO } from '../../interfaces/LoteDTO.interface';
import { LoteEntradaDTO } from '../../interfaces/LoteEntradaDTO.interface';
import { LotesTipo } from '../../interfaces/LotesTipo.interface';
import { NombreCuota } from '../../interfaces/NombreCuota.interface';
import { QamarkDTO } from '../../interfaces/QamarkDTO.interface';
import { ReporteCuota } from '../../interfaces/ReporteCuota.interface';
import { SalidaDTO } from '../../interfaces/SalidaDTO.interface';
import { TipoCuotaDict } from '../../interfaces/TipoCuotaDict.interface';
import { TipoLote } from '../../../rendimientos/interfaces/TipoLote.interface';

@Component({
  selector: 'app-reporte-cuota',
  templateUrl: './reporte-cuota.component.html',
  styleUrls: ['./reporte-cuota.component.css'],
})
export class ReporteCuotaComponent implements OnInit {
  fechaDesde!:                Date;
  fechaDesdeStr!:             string;
  fechaHasta!:                Date;
  fechaHastaStr!:             string;
  fechasReporte!:             Date[];
  cajasLote:                  SalidaDTO[]           = [];
  confReporteCuota:           ConfReporteCuotaDTO[] = [];
  idsReportes:                number[]              = [];
  lotes:                      LoteDTO[]             = [];
  lotesEntrada:               LoteEntradaDTO[]      = [];
  lotesTipo:                  LotesTipo[]           = [];
  qamarks:                    QamarkDTO[]           = [];
  reporteCuotaData:           ReporteCuota[]        = [];
  tiposCuota:                 ConfTipoCuotaDTO[]    = [];
  reportes:                   TipoCuotaDict         = {};
  nombresReportes:            NombreCuota           = {};
  comparativoData:            Comparativo[]         = [];
  qamarksUnicos:              QamarkDTO[]           = [];
  comparativoDataFiltrada:    Comparativo[]         = [];
  comparativoCuota:           Comparativo[]         = [];
  comparativoNoCuota:         Comparativo[]         = [];
  comparativosPorIdCuota:     Comparativo[][]       = [];
  dictComparativoCuota:       ComparativoDict       = {};
  dictComparativoNoCuota:     ComparativoDict       = {};
  cuotaComparativoReporte:    ComparativoReporte[]  = [];
  noCuotaComparativoReporte:  ComparativoReporte[]  = [];
  qamarksCuota:               number[]              = [];
  qamarksNoCuota:             number[]              = [];
  nombreReporte:              string                = '';
  idReporte:                  number                = 8;
  ist:                        boolean               = false;

  tiposLote: TipoLote[] = [];
  fechasReporteStr: string[] = [];

  hoy: Date = new Date();
  hoyStr: string = this.formatearFecha(this.hoy);

  constructor(
    private cuotaService: CuotaService,
    private ccs:          CommonCuotaService
  ) {}
  
  async ngOnInit(): Promise<void> {
    this.resetearFechas();
    this.resetearValores();
    this.nombreReporte = `Rendimientos cuota del ${this.fechaDesdeStr} al ${this.fechaHastaStr}`;
  }

  private setDataComparativo(): void {
    this.cuotaComparativoReporte = [];
    this.noCuotaComparativoReporte = [];
    this.qamarksCuota = [];
    this.qamarksNoCuota = [];
    this.comparativoData          = this.ccs.getComparativoData(this.idsReportes, this.reportes);
    this.qamarksUnicos            = this.ccs.getQamarksUnicos(this.comparativoData, this.qamarks);
    this.comparativoDataFiltrada  = this.ccs.agruparDataComparativo(this.comparativoData, this.idsReportes);
    this.comparativoCuota         = this.comparativoDataFiltrada.filter(cdf => cdf.tipo == 'CUOTA');
    this.comparativoNoCuota       = this.comparativoDataFiltrada.filter(cdf => cdf.tipo == 'NO CUOTA');

    this.comparativoCuota
    .sort((a, b) => a.conditon <= b.conditon ? -1 : 1)
    .sort((a, b) => a.qamark <= b.qamark ? -1 : 1);
    
    this.comparativoNoCuota
    .sort((a, b) => a.conditon <= b.conditon ? -1 : 1)
    .sort((a, b) => a.qamark <= b.qamark ? -1 : 1);

    this.cuotaComparativoReporte = this.ccs.formatearDatosComparativo(this.comparativoCuota, this.qamarksUnicos, this.idsReportes);
    this.noCuotaComparativoReporte = this.ccs.formatearDatosComparativo(this.comparativoNoCuota, this.qamarksUnicos, this.idsReportes);
    this.qamarksCuota   = Array.from(new Set(this.cuotaComparativoReporte.map(c => c.qamark)));
    this.qamarksNoCuota = Array.from(new Set(this.noCuotaComparativoReporte.map(c => c.qamark)));    
  }

  onCambioFecha(): void {
    this.nombreReporte = `Rendimientos cuota del ${this.fechaDesdeStr} al ${this.fechaHastaStr}`;
  }

  private resetearValores(): void { 
    this.cajasLote        = [];
    this.confReporteCuota = [];
    this.idsReportes      = [];
    this.lotes            = [];
    this.lotesEntrada     = [];
    this.lotesTipo        = [];
    this.qamarks          = [];
    this.reporteCuotaData = [];
    this.tiposCuota       = [];
    this.reportes         = {};
    this.nombresReportes  = {};
    this.tiposLote        = [];
  }

  private resetearFechas(): void {
    this.fechaDesde     = new Date();
    this.fechaDesdeStr  = this.formatearFecha(this.fechaDesde);
    this.fechaHasta     = new Date();
    this.fechaHastaStr  = this.formatearFecha(this.fechaHasta);
    this.fechasReporte  = [];
  }

  private async getTiposCuota(): Promise<void> {
    this.tiposCuota = await lastValueFrom(this.cuotaService.getTipoCuota());
  }

  private async getLotesPorTipos(): Promise<void> {
    this.confReporteCuota = await lastValueFrom(
      this.cuotaService.getConfReporteCuota()
    );
  }

  private async getQamarks(): Promise<void> {
    this.qamarks = await lastValueFrom(
      this.cuotaService.getQamarks()
    );
  }

  private formatearFecha(fecha: Date): string {
    let f = fecha;
    return formatDate(
      f.setHours(f.getHours() + 3),
      'yyyy-MM-dd',
      'es-UY'
    );
  }


  async hacerReporte(): Promise<void> {
    this.ist = true;
    this.resetearValores();
    this.setListaFechas();
    await this.getDatosCuota();
    await this.getQamarks();
    await this.setReporteCuotaDatos();
    this.getIdsReportes();
    this.setDataComparativo();
    this.tiposLote = this.setTiposLote();
  }

  private setTiposLote(): TipoLote[] {  
    let tipoLote: TipoLote[] = [];
    this.lotesTipo.forEach(lote => {
      lote.lotes.forEach(lt => {
        tipoLote.push({
          idTipo: lote.id,
          lote: lt
        });
      });
    });        
    return tipoLote;
  }

  private setListaFechas(): void {
    this.fechasReporte    = [];
    this.fechasReporteStr = [];

    const fechaInicio = new Date(this.fechaDesdeStr);
    const fechaFin    = new Date(this.fechaHastaStr);

    fechaInicio.setUTCHours(0, 0, 0, 0);
    fechaFin.setUTCHours(0, 0, 0, 0);

    let fechaActual = new Date(fechaInicio);
    while (fechaActual <= fechaFin) {
      this.fechasReporte.push(new Date(fechaActual));
      this.fechasReporteStr.push(this.formatearFecha(new Date(fechaActual)));
      fechaActual.setDate(fechaActual.getDate() + 1);
    }
  }

  private async getDatosCuota(): Promise<void> {
    await this.getTiposCuota();
    await this.getLotesPorTipos();
    this.mapearTiposYLotes();
  }

  private mapearTiposYLotes(): void {
    this.tiposCuota.forEach((tc) => {
      if (tc.activo) {
        const lotesPorTipo = this.confReporteCuota.filter(
          (crc) => crc.idTipo === tc.id
        );
        const arrayLotes = Array.from(lotesPorTipo.map((lt) => lt.lote));
        this.lotesTipo.push({
          id: tc.id,
          lotes: arrayLotes,
        });
      }
    });
  }

  private lotesToSting(lotes: number[]): string {
    return lotes.join(',');
  }

  private async setReporteCuotaDatos(): Promise<void> {
    let dwCajas:        DWCajaSalidaDTO[] = [];
    let dwCortes:       DWSalidaDTO[]     = [];
    let dwLotesEntrada: LoteEntradaDTO[]  = [];

    let cajasT: DWCaja[] = [];
    
    const ultimaFechaReporte = this.formatearFecha(this.fechasReporte[this.fechasReporte.length - 1]);
    if(this.hoyStr == ultimaFechaReporte) await lastValueFrom(this.cuotaService.execInsertarDatosDW());
    
    this.reporteCuotaData = [];
    this.idsReportes      = [];
    
    let fechaD = this.fechasReporteStr[0]; 
    let fechaH = this.fechasReporteStr[this.fechasReporteStr.length - 1];

    dwCajas = await lastValueFrom(this.cuotaService.getDWCajasLotes(fechaD, fechaH, 'CUOTA'));      
    cajasT = this.parsearCajas(dwCajas);
    
    for (const lt of this.lotesTipo) {
      const shnameCuota = this.tiposCuota.find(t => t.id === lt.id)?.shname;
      const lotesStr  = this.lotesToSting(lt.lotes);
    
      if(cajasT.length > 0) {
        dwCortes = await lastValueFrom(this.cuotaService.getDWCortes(fechaD, fechaH, lotesStr));
        if(dwCortes.length > 0) {
          const cortesT: DWCorte[] = this.parsearCortes(dwCortes);
          const ctsCuota = cortesT.filter(c => c.customer?.startsWith('CUOTA'));
          const conditions: string[] = Array.from(
            new Set(
              ctsCuota
                .filter(c => c.condition.includes(shnameCuota!))
                .map(c => c.condition)
            )
          );

          dwLotesEntrada = await lastValueFrom(this.cuotaService.getDWELotesEntrada(fechaD, fechaH, lotesStr));
          let entradaT: DWEntrada[] = this.parsearEntrada(dwLotesEntrada);

          this.fechasReporteStr.forEach(fecha => {
            const entrada = entradaT.filter(e => e.fecha === fecha);        
            const cortes  = cortesT.filter(c => c.fecha === fecha && !c.customer?.includes('CUOTA'));
            const cajas = cajasT.filter(c => c.fecha === fecha && conditions.includes(c.condition!));

            let productos: SalidaDTO[] = [];

            cortes.forEach(ct => {
              let c: SalidaDTO = {
                cajas: 0,
                code: ct.codigo,
                condition: ct.condition,
                name: ct.producto,
                peso: ct.peso,
                piezas: ct.piezas,
                qamark: ct.marca,
                tipo: 'NO CUOTA',
                pesoPorPieza: ct.peso / ct.piezas
              };
              productos.push(c);
            });

            cajas.forEach(cj => {
              let c: SalidaDTO = {
                cajas: cj.cajas,
                code: cj.code,
                condition: cj.condition!,
                name: cj.producto,
                peso: cj.peso,
                piezas: cj.piezas,
                qamark: cj.qamark!,
                tipo: 'CUOTA',
                pesoPorPieza: cj.peso / cj.piezas
              };
              productos.push(c);
            });
            
            const repoCta: ReporteCuota = {
              id:       lt.id,
              fecha:    fecha,
              entrada:  this.mapEntrada(entrada),
              cortes:   productos,
            };

            if(entrada.length > 0) {
              this.idsReportes.push(repoCta.id);
              this.reporteCuotaData.push(repoCta);
            }
          });
        }
      }
    }    
    this.setNombresReportes();
    this.agruparReportesPorId();
  }

  private getIdsReportes(): void {
    this.idsReportes = Array.from(new Set(this.reporteCuotaData.map(rcd => rcd.id))).sort((a, b) => a - b);
  }

  getNombrePorId(id: number): string {
    return this.tiposCuota.find((tp) => tp.id === id)?.nombre!;
  }

  filtrarReportesPorId(id: number): ReporteCuota[] {        
    return this.reporteCuotaData.filter(rcd => rcd.id === id);
  }

  private agruparReportesPorId(): void {
    this.getIdsReportes();
    this.idsReportes.forEach(id => {
      this.reportes[id] = this.filtrarReportesPorId(id);
    });    
  }

  private setNombresReportes(): void {
    this.idsReportes.forEach(id => {
      this.nombresReportes[id] = this.getNombrePorId(id);
    });
  }
 
  nombreQamark(id: number): string {
    return this.qamarks.find(q => q.qamark === id)?.name!;
  }
 
  comparativoPorIdCuota(id: number, c: ComparativoReporte[]): ComparativoReporte[] { 
    return c.filter(c => c.idCuota == id);
  }

  private parsearEntrada(entrada: LoteEntradaDTO[]): DWEntrada[] {
    let dwEntrada: DWEntrada[] = entrada.map(item => ({
     fecha: formatDate(item.fecha, 'yyyy-MM-dd', 'es-UY'),
     code: item.code,
     cuartos: item.cuartos,
     lote: item.lote,
     peso: item.peso,
     tipoCuarto: item.tipoCuarto
    }));
    return dwEntrada;
  }

  private parsearCajas(cajas: DWCajaSalidaDTO[]): DWCaja[] {
    let dwCajas: DWCaja[] = cajas.map(caja => ({
      fecha: formatDate(caja.fecha, 'yyyy-MM-dd', 'es-UY'),
      condition: caja.condition,
      code: caja.code,
      producto: caja.producto,
      customercode: caja.customercode,
      qamark: caja.qamark,
      piezas: caja.piezas,
      cajas: caja.cajas,
      peso: caja.peso
    }));
    return dwCajas;
  }
  
  private parsearCortes(cortes: DWSalidaDTO[]): DWCorte[] {
    let dwCortes: DWCorte[] = cortes.map(corte => ({
      fecha: formatDate(corte.fecha, 'yyyy-MM-dd','es-UY'),
      codigo: corte.codigo,
      condition: corte.condition,
      lote: corte.lote,
      marca: corte.marca,
      material: corte.material,
      peso: corte.peso,
      piezas: corte.piezas,
      producto: corte.producto,
      customer: corte.customer
    }));
    return dwCortes;
  }

  private mapEntrada(entrada: DWEntrada[]): LoteEntradaDTO[] {
    let loteEntrada: LoteEntradaDTO[] = entrada.map(item => ({
      fecha: new Date(item.fecha),
      code: item.code,
      cuartos: item.cuartos,
      lote: item.lote,
      peso: item.peso,
      tipoCuarto: item.tipoCuarto
     }));
     return loteEntrada; 
  }

}
 