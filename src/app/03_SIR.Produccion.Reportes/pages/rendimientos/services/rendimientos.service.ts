import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CorteDataDTO } from '../interfaces/CorteDataDTO.interface';
import { urlConfTipoRendimiento, urlCortesPorLoteYFecha, urlLotesActivos, urlLotesPorTipo } from 'src/settings';
import { ConfTipoRendimiento } from '../interfaces/ConfTipoRendimiento.interface';
import { LotePorTipo } from '../interfaces/LotePorTipo.interface';
import { TipoLote } from '../interfaces/TipoLote.interface';

@Injectable({
  providedIn: 'root'
})
export class RendimientosService {

  constructor(private http: HttpClient) { }

  getConfTipoRendimiento(): Observable<ConfTipoRendimiento[]> {
    return this.http.get<ConfTipoRendimiento[]>(urlConfTipoRendimiento);
  }

  getLotesPorTipo(idTipo: number): Observable<LotePorTipo[]> {
    return this.http.get<LotePorTipo[]>(`${urlLotesPorTipo}?idTipo=${idTipo}`)
  }

  getLotesActivos(): Observable<TipoLote[]> {
    return this.http.get<TipoLote[]>(urlLotesActivos);
  }

  getCortesPorLoteYFecha(fechaDesde: string, fechaHasta: string, lotes: string): Observable<CorteDataDTO[]> {
    const urlCortes: string = `${urlCortesPorLoteYFecha}?fechaProduccionDesde=${fechaDesde}&fechaProduccionHasta=${fechaHasta}&lotesStr=${lotes}`;
    return this.http.get<CorteDataDTO[]>(urlCortes)
  }
}
