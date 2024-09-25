import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LoteEntradaDTO } from '../interfaces/LoteEntradaDTO.interface';
import { urlConfReporteCuota, urlDWCajaLote, urlDWCortesPorFecha, urlDWLoteEntrada, urlExecInsertarDatosDW, urlGetCajasLote, urlGetLotesEntrada, urlGetUltimaFechaEntrada, urlLotes, urlQamarks, urlTipoCuota } from 'src/settings';
import { SalidaDTO } from '../interfaces/SalidaDTO.interface';
import { ConfTipoCuotaDTO } from '../interfaces/ConfTipoCuotaDTO.interface';
import { ConfReporteCuotaDTO } from '../interfaces/ConfReporteCuotaDTO.interface';
import { LoteDTO } from '../interfaces/LoteDTO.interface';
import { QamarkDTO } from '../interfaces/QamarkDTO.interface';
import { DWCajaSalidaDTO } from '../interfaces/DWCajaSalidaDTO.interface';
import { DWSalidaDTO } from '../interfaces/DWSalidaDTO.interface';

@Injectable({
  providedIn: 'root'
})
export class CuotaService {

  constructor(private http: HttpClient) { }

  getLotesEntrada(fechaDesde: string, fechaHasta: string, lotes: string): Observable<LoteEntradaDTO[]> {
    const urlLotes: string = `${urlGetLotesEntrada}?fechaProduccionDesde=${fechaDesde}&fechaProduccionHasta=${fechaHasta}&lotesStr=${lotes}`;
    return this.http.get<LoteEntradaDTO[]>(urlLotes);
  }

  getCajasLotes(fechaProduccion: string, lotes: string): Observable<SalidaDTO[]> {
    const urlCajas: string = `${urlGetCajasLote}?fechaProduccion=${fechaProduccion}&lotes=${lotes}`;
    return this.http.get<SalidaDTO[]>(urlCajas);
  }

  getTipoCuota(): Observable<ConfTipoCuotaDTO[]> {
    return this.http.get<ConfTipoCuotaDTO[]>(urlTipoCuota);
  }

  getConfReporteCuota(): Observable<ConfReporteCuotaDTO[]> {
    return this.http.get<ConfReporteCuotaDTO[]>(urlConfReporteCuota);
  }

  getLotes(lotes: string): Observable<LoteDTO[]> {
    return this.http.get<LoteDTO[]>(`${urlLotes}?lotes=${lotes}`);
  }

  getQamarks(): Observable<QamarkDTO[]> {
    return this.http.get<QamarkDTO[]>(urlQamarks);
  }

  getDWELotesEntrada(fechaDesde: string, fechaHasta: string, lotes: string): Observable<LoteEntradaDTO[]> {
    const urlLotes: string = `${urlDWLoteEntrada}?fechaProduccionDesde=${fechaDesde}&fechaProduccionHasta=${fechaHasta}&lotesStr=${lotes}`;
    return this.http.get<LoteEntradaDTO[]>(urlLotes);
  }

  getDWCajasLotes(fechaDesde: string, fechaHasta: string, filtro: string): Observable<DWCajaSalidaDTO[]> {
    const urlCajas: string = `${urlDWCajaLote}?fechaProduccionDesde=${fechaDesde}&fechaProduccionHasta=${fechaHasta}&filtro=${filtro}`;
    return this.http.get<DWCajaSalidaDTO[]>(urlCajas);
  }

  getDWCortes(fechaDesde: string, fechaHasta: string, lotes: string): Observable<DWSalidaDTO[]> {
    const urlCortes: string = `${urlDWCortesPorFecha}?fechaProduccionDesde=${fechaDesde}&fechaProduccionHasta=${fechaHasta}&lotesStr=${lotes}`;
    return this.http.get<DWSalidaDTO[]>(urlCortes);
  }

  getUltimaFechaEntrada(): Observable<Date | null> {
    return this.http.get<Date | null>(urlGetUltimaFechaEntrada);
  }

  execInsertarDatosDW(): Observable<void> {
    return this.http.get<void>(urlExecInsertarDatosDW);
  }
}