import { Component, OnInit } from '@angular/core';
import { formatDate } from '@angular/common';
import { lastValueFrom } from 'rxjs';

import { CommonCuotaService } from '../../services/common-cuota.service';
import { Comparativo } from '../../interfaces/Comparativo.inteface';
import { ConfReporteCuotaDTO } from '../../interfaces/ConfReporteCuotaDTO.interface';
import { ConfTipoCuotaDTO } from '../../interfaces/ConfTipoCuotaDTO.interface';
import { CuotaService } from '../../services/cuota.service';
import { LoteDTO } from '../../interfaces/LoteDTO.interface';
import { LoteEntradaDTO } from '../../interfaces/LoteEntradaDTO.interface';
import { LotesTipo } from '../../interfaces/LotesTipo.interface';
import { NombreCuota } from '../../interfaces/NombreCuota.interface';
import { QamarkDTO } from '../../interfaces/QamarkDTO.interface';
import { ReporteCuota } from '../../interfaces/ReporteCuota.interface';
import { SalidaDTO } from '../../interfaces/SalidaDTO.interface';
import { TipoCuotaDict } from '../../interfaces/TipoCuotaDict.interface';
import { ComparativoDict } from '../../interfaces/ComprativoDict.interface';
import { ComparativoReporte } from '../../interfaces/ComparativoReporte.interface';

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
    this.comparativoData          = this.ccs.getComparativoData(this.idsReportes, this.reportes);
    this.qamarksUnicos            = this.ccs.getQamarksUnicos(this.comparativoData, this.qamarks);
    this.comparativoDataFiltrada  = this.ccs.agruparDataComparativo(this.comparativoData, this.idsReportes);
    this.comparativoCuota         = this.comparativoDataFiltrada.filter(cdf => cdf.tipo == 'CUOTA');
    this.comparativoNoCuota       = this.comparativoDataFiltrada.filter(cdf => cdf.tipo == 'NO CUOTA');

    this.comparativoCuota
    .sort((a, b) => {
      if(a.conditon <= b.conditon) return -1;
      return 1;
    })
    .sort((a, b) => {
      if(a.qamark <= b.qamark) return -1;
      return 1
    });
    
    this.comparativoNoCuota
    .sort((a, b) => {
      if(a.conditon <= b.conditon) return -1;
      return 1;
    })
    .sort((a, b) => {
      if(a.qamark <= b.qamark) return -1;
      return 1
    });

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
    return formatDate(
      fecha.setHours(fecha.getHours() + 3),
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
  }

  private setListaFechas(): void {
    this.fechasReporte  = [];
    const fechaInicio   = new Date(this.fechaDesdeStr);
    const fechaFin      = new Date(this.fechaHastaStr);

    let fechaActual = new Date(fechaInicio);
    while (fechaActual <= fechaFin) {
      this.fechasReporte.push(new Date(fechaActual));
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
    this.reporteCuotaData = [];
    this.idsReportes      = [];
    for (const f of this.fechasReporte) {
      const fecha = this.formatearFecha(f);

      for (const lt of this.lotesTipo) {
        const lotesStr  = this.lotesToSting(lt.lotes);
        const entrada   = await lastValueFrom(
          this.cuotaService.getLotesEntrada(fecha, fecha, lotesStr)
        );

        if (entrada.length > 0) {
          const cortes = await lastValueFrom(
            this.cuotaService.getCajasLotes(fecha, lotesStr)
          );
          const repoCta: ReporteCuota = {
            id:       lt.id,
            fecha:    fecha,
            entrada:  entrada,
            cortes:   cortes,
          };
          this.idsReportes.push(repoCta.id);
          this.reporteCuotaData.push(repoCta);
        }
      }
    }

    this.agruparReportesPorId();
    this.setNombresReportes();
  }

  private getIdsReportes(): void {
    this.idsReportes = Array.from(
      new Set(this.reporteCuotaData.map(rcd => rcd.id))
    ).sort((a, b) => {
      if (a <= b) return -1;
      return 1;
    });
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
}
