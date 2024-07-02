import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { urlGetContainers, urlGetDataByContainer, urlGetPreciosPorFechas, urlGetTiposMoneda } from 'src/settings';
import { DWContainer } from '../Interfaces/DWContainer.interface';
import { ConfMoneda } from '../Interfaces/ConfMoneda.interface';
import { ConfPreciosDTO } from '../Interfaces/ConfPrecios.DTOinterface';

@Injectable({
  providedIn: 'root'
})
export class CargaKosherService {

  constructor(private http: HttpClient) { }

  getContainers(): Observable<string[]> {
    return this.http.get<string[]>(urlGetContainers);
  }

  getDataByContainer(containers: string): Observable<DWContainer[]> {
    return this.http.get<DWContainer[]>(`${urlGetDataByContainer}?containers=${containers}`);
  }

  getTiposMoneda(): Observable<ConfMoneda[]> {
    return this.http.get<ConfMoneda[]>(urlGetTiposMoneda);
  }

  getPreciosPorFecha(fechaDesde: string, fechaHasta: string): Observable<ConfPreciosDTO[]> {
    return this.http.get<ConfPreciosDTO[]>(`${urlGetPreciosPorFechas}?fechaDesde=${fechaDesde}&fechaHasta=${fechaHasta}`)
  }
}
