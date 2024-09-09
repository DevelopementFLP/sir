import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LoteEntradaDTO } from '../interfaces/LoteEntradaDTO.interface';
import { urlConfReporteCuota, urlGetCajasLote, urlGetLotesEntrada, urlLotes, urlQamarks, urlTipoCuota } from 'src/settings';
import { SalidaDTO } from '../interfaces/SalidaDTO.interface';
import { ConfTipoCuotaDTO } from '../interfaces/ConfTipoCuotaDTO.interface';
import { ConfReporteCuotaDTO } from '../interfaces/ConfReporteCuotaDTO.interface';
import { LoteDTO } from '../interfaces/LoteDTO.interface';
import { QamarkDTO } from '../interfaces/QamarkDTO.interface';

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
}