import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CabezaFaenada } from '../interfaces/CabezaFaenada.interface';
import { urlCabezasFaenadas, urlTemperaturasC9C10 } from 'src/settings';
import { Observable } from 'rxjs';
import { DataTemperatura } from '../interfaces/DataTemperatura.interface';

@Injectable({
  providedIn: 'root'
})
export class MantenimientoService {

  constructor(private http: HttpClient) { }

  getCabezasFaenadas(fechaFaenaDesde: string, fechaFaenaHasta: string): Observable<CabezaFaenada[]> {
    return this.http.get<CabezaFaenada[]>(`${urlCabezasFaenadas}?fechaFaenaDesde=${fechaFaenaDesde}&fechaFaenaHasta=${fechaFaenaHasta}`);
  }

  getDataTemperaturasC9C10(fechaDesde: string, fechaHasta: string): Observable<DataTemperatura[]> {
    return this.http.get<DataTemperatura[]>(`${urlTemperaturasC9C10}?fechaDesde=${fechaDesde}&fechaHasta=${fechaHasta}`)
  }
}
