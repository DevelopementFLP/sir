import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { urlDeleteFechaPrecios, urlGetContainers, urlGetDataByContainer, urlGetPrecios, urlGetPreciosPorFechas, urlGetTiposMoneda } from 'src/settings';
import { DWContainer } from '../Interfaces/DWContainer.interface';
import { ConfMoneda } from '../Interfaces/ConfMoneda.interface';
import { ConfPreciosDTO } from '../Interfaces/ConfPrecios.DTOinterface';
import { ContainerDTO } from '../Interfaces/ContainerDTO.interface';

@Injectable({
  providedIn: 'root'
})
export class CargaKosherService {

  constructor(private http: HttpClient) { }

  getContainers(): Observable<ContainerDTO[]> {
    return this.http.get<ContainerDTO[]>(urlGetContainers);
  }

  getDataByContainer(idCarga:number, containers: string): Observable<DWContainer[]> {
    return this.http.get<DWContainer[]>(`${urlGetDataByContainer}?idCarga=${idCarga}&containers=${containers}`);
  }

  getTiposMoneda(): Observable<ConfMoneda[]> {
    return this.http.get<ConfMoneda[]>(urlGetTiposMoneda);
  }

  getPreciosPorFecha(fechaDesde: string, fechaHasta: string): Observable<ConfPreciosDTO[]> {
    return this.http.get<ConfPreciosDTO[]>(`${urlGetPreciosPorFechas}?fechaDesde=${fechaDesde}&fechaHasta=${fechaHasta}`)
  }

  getPrecios(): Observable<ConfPreciosDTO[]> {
    return this.http.get<ConfPreciosDTO[]>(urlGetPrecios);
  }

  deleteFechaPrecio(fechas: string[]): Observable<void> {
    const httpOptions = { body: fechas };
    return this.http.delete<void>(urlDeleteFechaPrecios, httpOptions);
  }  
}
