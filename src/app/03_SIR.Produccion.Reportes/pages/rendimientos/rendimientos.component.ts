import { Component, OnInit } from '@angular/core';
import { ConfTipoRendimiento } from './interfaces/ConfTipoRendimiento.interface';
import { RendimientosService } from './services/rendimientos.service';
import { lastValueFrom } from 'rxjs';
import { LotePorTipo } from './interfaces/LotePorTipo.interface';
import { CorteLote } from './interfaces/CorteLote.interface';
import { TipoLote } from './interfaces/TipoLote.interface';
import { CuotaService } from '../cuota/services/cuota.service';
import { DWSalidaDTO } from '../cuota/interfaces/DWSalidaDTO.interface';
import { LoteEntradaDTO } from '../cuota/interfaces/LoteEntradaDTO.interface';
import { formatDate } from '@angular/common';
import { QamarkDTO } from '../cuota/interfaces/QamarkDTO.interface';
import { TipoFechaDataAgrupado } from './interfaces/TipoFechaDataAgrupado.interface';
import { GrupoComparativo } from '../../interfaces/GrupoComparativo.interface';
import { ComparativoCodigosService } from '../../services/comparativo-codigos.service';

@Component({
  selector: 'app-rendimientos',
  templateUrl: './rendimientos.component.html',
  styleUrls: ['./rendimientos.component.css']
})
export class RendimientosComponent implements OnInit {

  tiposRendimientosSeleccionados: boolean[] = [];
  rendimientosAgrupados:          TipoFechaDataAgrupado[] = [];
  nombresRendimientosComparativos: string[] = [];

  fechaDesde!:        Date;
  fechaDesdeStr!:     string;
  fechaHasta!:        Date;
  fechaHastaStr!:     string;
  fechasReporte!:     Date[];

  fechasReporteStr:   string[] = [];

  tiposRendimientos:  ConfTipoRendimiento[] = [];
  lotesPorTipo:       LotePorTipo[]         = [];
  dataCortes:         CorteLote[]           = [];
  lotesActivos:       TipoLote[]            = [];

  lotesEntrada:       LoteEntradaDTO[]      = [];
  cortes:             DWSalidaDTO[]         = [];
  data:               CorteLote[][]         = [];

  idsRendimientos:    number[]              = [];
  nombresRends:       string[]              = [];

  nombreReporte:      string                = '';
  idReporte:          number                = 9
  hoy:                Date                  = new Date();
  hoyStr:             string                = this.formatearFecha(this.hoy);

  qamarks:            QamarkDTO[]           = [];

  constructor(
    private rendSrvc:   RendimientosService,
    private cuotaSrvc:  CuotaService,
    private comparativoService: ComparativoCodigosService
  ) {}

  get dataPrint() {    
    return {
        rendimientos: this.data,
        comparativo: this.dataCortes,
        fechas: this.fechasReporte,
        nombresRend: this.nombresRends,
        idsRend: this.idsRendimientos,
        qamarks: this.qamarks,
        tiposSeleccionados: this.tiposRendimientosSeleccionados,
        dataAgrupada:  this.rendimientosAgrupados,
        nombresComparativos: this.nombresRendimientosComparativos
    }
  }

  recibirTiposRendimientos(tipos: boolean[]) {
    this.tiposRendimientosSeleccionados = tipos;
  }

  recibirRendimientosAgrupados(rends: TipoFechaDataAgrupado[]) {
    this.rendimientosAgrupados = rends;
  }

  recibirNombresRendimientos(nombres: string[]) {
    this.nombresRendimientosComparativos = nombres;
  }

  async ngOnInit(): Promise<void> {
    await lastValueFrom(this.cuotaSrvc.execInsertarDatosDW());
    this.resetearFechas();
    
    await this.setTiposRendimientos();
    await this.setLotesActivos();
    await this.setQamarks();

    this.nombreReporte = `Rendimientos desosado marel del ${this.fechaDesdeStr} al ${this.fechaHastaStr}`;
  }

  private async setLotesActivos(): Promise<void> {
    this.lotesActivos = await lastValueFrom(this.rendSrvc.getLotesActivos());
  }

  private async setTiposRendimientos(): Promise<void> {
    this.tiposRendimientos = await lastValueFrom(this.rendSrvc.getConfTipoRendimiento());
  }

  private async setQamarks(): Promise<void> {
    this.qamarks = await lastValueFrom(this.cuotaSrvc.getQamarks());
  }

  private async setDataCortes(): Promise<void> {
    this.tiposRendimientos.forEach(async tr => {
      if(tr.activo) {
        const lotes:    TipoLote[]        = this.lotesActivos.filter(lt => lt.idTipo == tr.id);
        const lotesArr: number[]          = Array.from(new Set(lotes.map(l => l.lote)));
        let entrada:    LoteEntradaDTO[]  = this.lotesEntrada.filter(lt => lotesArr.includes(lt.lote));
        let cortes:     DWSalidaDTO[]     = this.cortes.filter(lt => lotesArr.includes(lt.lote));
        if(entrada.length > 0)
        {
          this.idsRendimientos.push(tr.id);
          this.nombresRends.push(tr.nombre);
          this.dataCortes.push({
            id: tr.id,
            nombre: tr.nombre,
            lotes: lotes,
            entrada: entrada,
            cortes: cortes
          })
        }
      } 
    });
  }

  private async setLotesEntrada(): Promise<void> {
    let fechaD = this.formatearFecha(this.fechasReporte[0]);
    let fechaH = this.formatearFecha(this.fechasReporte[this.fechasReporte.length - 1]);
    const lotesArr: number[] = Array.from(new Set(this.lotesActivos.map(l => l.lote)));
    this.lotesEntrada = await lastValueFrom(this.cuotaSrvc.getLotesEntrada(fechaD, fechaH, this.lotesToSting(lotesArr)));
  }

  private async setCortes(): Promise<void> {
    let fechaD = this.formatearFecha(this.fechasReporte[0]);
    let fechaH = this.formatearFecha(this.fechasReporte[this.fechasReporte.length - 1]);
    const lotesArr: number[] = Array.from(new Set(this.lotesActivos.map(l => l.lote)));
    this.cortes = await lastValueFrom(this.cuotaSrvc.getDWCortes(fechaD, fechaH, this.lotesToSting(lotesArr)));    
  }

  private setIdsNombresRendimientos(): void {
    this.idsRendimientos = Array.from(new Set(this.idsRendimientos.map(id => id)));
    this.nombresRends = Array.from(new Set(this.nombresRends.map(nm => nm)));
  }

  private setDataRendimientos(): void {
    this.idsRendimientos.forEach(id => {
      const d = this.dataCortes.filter(dc => dc.id === id);
      this.data.push(d);
    });    
  }
  
  private formatearFecha(fecha: Date): string {
    let f = fecha;
    return formatDate(
      f.setHours(f.getHours() + 3),
      'yyyy-MM-dd',
      'es-UY'
    );
  }

  private setListaFechas(): void {
    this.fechasReporte  = [];
    this.fechasReporteStr = [];

    const fechaInicio   = new Date(this.fechaDesdeStr);
    const fechaFin      = new Date(this.fechaHastaStr);

    let fechaActual = new Date(fechaInicio);
    while (fechaActual <= fechaFin) {
      this.fechasReporte.push(new Date(fechaActual));
      this.fechasReporteStr.push(this.formatearFecha(new Date(fechaActual)));
      fechaActual.setDate(fechaActual.getDate() + 1);
    }    
  }

  private resetearFechas(): void {
    this.fechaDesde     = new Date();
    this.fechaDesdeStr  = this.formatearFecha(this.fechaDesde);
    this.fechaHasta     = new Date();
    this.fechaHastaStr  = this.formatearFecha(this.fechaHasta);
    this.fechasReporte  = [];
  }

  private lotesToSting(lotes: number[]): string {
    return lotes.join(',');
  }

  onCambioFecha(): void {
    this.nombreReporte = `Rendimientos desosado marel del ${this.fechaDesdeStr} al ${this.fechaHastaStr}`;
  }

  private resetData(): void {
    this.idsRendimientos  = [];
    this.nombresRends     = [];
    this.dataCortes       = [];
    this.data             = [];
  }

  async hacerReporte(): Promise<void> {
    await this.resetData();
    await this.setListaFechas();    
    await this.setLotesEntrada();
    await this.setCortes();
    await this.setDataCortes();
    await this.setIdsNombresRendimientos();
    await this.setDataRendimientos();    
  }

  protected actualizarQamarksComparativoCodigos(qamarks: string[]): void {
    this.comparativoService.actualizarQamarksComparativoCodigos(qamarks);
  }

  protected actualizarGruposComparativoCodigos(grupos: GrupoComparativo[]): void {
    this.comparativoService.actualizarGruposComparativoCodigos(grupos);
  }
}
