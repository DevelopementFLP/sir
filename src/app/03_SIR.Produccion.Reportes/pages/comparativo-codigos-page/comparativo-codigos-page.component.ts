import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { RendimientosComponent } from '../rendimientos/rendimientos.component';
import { ReporteCuotaComponent } from '../cuota/pages/reporte-cuota/reporte-cuota.component';
import { formatDate } from '@angular/common';
import { TipoLote } from '../rendimientos/interfaces/TipoLote.interface';
import { ConfTipoRendimiento } from '../rendimientos/interfaces/ConfTipoRendimiento.interface';
import { ConfTipoCuotaDTO } from '../cuota/interfaces/ConfTipoCuotaDTO.interface';
import { QamarkDTO } from '../cuota/interfaces/QamarkDTO.interface';
import { ComparativoCodigosService } from '../../services/comparativo-codigos.service';
import { GrupoComparativo } from '../../interfaces/GrupoComparativo.interface';

@Component({
  selector: 'app-comparativo-codigos-page',
  templateUrl: './comparativo-codigos-page.component.html',
  styleUrls: ['./comparativo-codigos-page.component.css']
})
export class ComparativoCodigosPageComponent implements OnInit, AfterViewInit {

  @ViewChild(RendimientosComponent) rendimientos!: RendimientosComponent;
  @ViewChild(ReporteCuotaComponent) cuotas!: ReporteCuotaComponent;

  fechaDesde!:        Date;
  fechaDesdeStr!:     string;
  fechaHasta!:        Date;
  fechaHastaStr!:     string;
  hoy:                Date  = new Date();
  hoyStr:             string  = this.formatearFecha(this.hoy);
  fechasReporteString: string[] = [];

  nombreReporte: string = '';
  idReporte: number = 11;

  mostrarSeleccionGrupos: boolean = false;

  lotesActivosRendimientos: TipoLote[] = [];
  lotesActivosCuota: TipoLote[] = [];
  tiposRendimientos: ConfTipoRendimiento[] = [];
  tiposCuota: ConfTipoCuotaDTO[] = [];
  qamarksRendimientos: QamarkDTO[] = [];
  qamarksCuota: QamarkDTO[] = [];

  lotesActivosAgrupados: TipoLote[] = [];
  qamarksAgrupados: QamarkDTO[] = [];
  tiposRendimientosAgrupados: ConfTipoRendimiento[] = [];

  grupos: GrupoComparativo[] = [];

  constructor (private comparativoService: ComparativoCodigosService) {}

  ngOnInit(): void {
    this.resetearFechas();
    this.nombreReporte = `Comparativos por códigos del ${this.fechaDesdeStr} al ${this.fechaHastaStr}`;
  }

  ngAfterViewInit(): void {
    if(this.rendimientos) this.rendimientos.ngOnInit();
    if(this.cuotas) this.cuotas.ngOnInit();
  }

  protected async setInformacion(): Promise<void> {
    this.resetearData();
    this.setListaFechas();
    await this.setDataRendimientos();
    this.lotesActivosAgrupados = this.unificarLotes();
    this.qamarksAgrupados = this.unificarQamarks();
    this.tiposRendimientosAgrupados = this.unificarTiposRendimientos();
    this.mostrarSeleccionGrupos = this.lotesActivosAgrupados.length > 0 && this.qamarksAgrupados.length > 0 && this.tiposRendimientosAgrupados.length > 0;
  }

  protected onCambioFecha(): void {
    this.nombreReporte = `Comparativos por códigos del ${this.fechaDesdeStr} al ${this.fechaHastaStr}`;
  }

  private resetearData(): void {
    this.lotesActivosRendimientos = [];
    this.lotesActivosCuota = [];
    this.tiposRendimientos = [];
    this.tiposCuota = [];
    this.qamarksRendimientos = [];
    this.qamarksCuota = [];
    this.lotesActivosAgrupados = [];
    this.qamarksAgrupados = [];
    this.tiposRendimientosAgrupados = [];
  }

  private resetearFechas(): void {
    this.fechaDesde     = new Date();
    this.fechaDesdeStr  = this.formatearFecha(this.fechaDesde);
    this.fechaHasta     = new Date();
    this.fechaHastaStr  = this.formatearFecha(this.fechaHasta);
  }

  private unificarTiposRendimientos(): ConfTipoRendimiento[] {
    this.tiposRendimientos = this.rendimientos.tiposRendimientos;
    this.tiposCuota = this.cuotas.tiposCuota;

    const tiposRendimientos: ConfTipoRendimiento[] =
    [
      ...this.tiposCuota.map(item => ({
        id: item.id,
        nombre: item.nombre,
        shname: item.shname,
        activo: item.activo
      })),
      ...this.tiposRendimientos
    ];

    return tiposRendimientos;
  }
 
  private unificarLotes(): TipoLote[] {
    this.lotesActivosRendimientos = this.rendimientos.lotesActivos;
    this.lotesActivosCuota = this.cuotas.tiposLote;

    const lotes: TipoLote[] = [...this.lotesActivosRendimientos, ...this.lotesActivosCuota];    
    return lotes;
  }

  private unificarQamarks(): QamarkDTO[] {
    this.qamarksRendimientos = this.rendimientos.qamarks;
    this.qamarksCuota = this.cuotas.qamarks;

    const combinado: QamarkDTO[] = [...this.qamarksRendimientos, ...this.qamarksCuota];
    const unificado: QamarkDTO[] = Array.from(
        new Map(combinado.map(item => [item.qamark, item])).values()
    );

    return unificado;
}

  private async setDataRendimientos(): Promise<void> {
    this.rendimientos.fechaDesdeStr = this.fechaDesdeStr;
    this.rendimientos.fechaHastaStr = this.fechaHastaStr;
    await this.rendimientos.hacerReporte();
    await this.cuotas.hacerReporte();
  }

  private setListaFechas(): void {
    this.fechasReporteString = [];

    const fechaInicio   = new Date(this.fechaDesdeStr);
    const fechaFin      = new Date(this.fechaHastaStr);

    let fechaActual = new Date(fechaInicio);
    while (fechaActual <= fechaFin) {
      this.fechasReporteString.push(this.formatearFecha(new Date(fechaActual)));
      fechaActual.setDate(fechaActual.getDate() + 1);
    }    
  }

  private formatearFecha(fecha: Date): string {
    let f = fecha;
    return formatDate(
      f.setHours(f.getHours() + 3),
      'yyyy-MM-dd',
      'es-UY'
    );
  }

  protected actualizarQamarksComparativoCodigos(qamarks: string[]): void {
    this.comparativoService.actualizarQamarksComparativoCodigos(qamarks);
  }

  protected actualizarGruposComparativoCodigos(grupos: GrupoComparativo[]): void {
    this.comparativoService.actualizarGruposComparativoCodigos(grupos);
    this.grupos = grupos;
  }
}
