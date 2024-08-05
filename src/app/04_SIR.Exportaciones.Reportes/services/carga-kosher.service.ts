import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { urlDeleteConfProductos, urlDeleteFechaPrecios, urlGetCajasCarga, urlGetConfProductos, urlGetContainers, urlGetDataByContainer, urlGetFechas, urlGetNombreProductoAsync, urlGetPrecios, urlGetPreciosPorFechas, urlGetTiposMoneda, urlInsertarPrecios, urlInsertConfProductos, urlUpdateConfProductos } from 'src/settings';
import { DWContainer } from '../Interfaces/DWContainer.interface';
import { ConfMoneda } from '../Interfaces/ConfMoneda.interface';
import { ConfPreciosDTO } from '../Interfaces/ConfPreciosDTO.interface';
import { ContainerDTO } from '../Interfaces/ContainerDTO.interface';
import { ConfPrecios } from '../Interfaces/ConfPrecios.interface';
import { DWCajaCarga } from '../Interfaces/DWCajaCarga.interface';
import { ConfProducto } from '../Interfaces/ConfProducto.interface';

@Injectable({
  providedIn: 'root'
})
export class CargaKosherService {

  constructor(private http: HttpClient) { }

  getContainers(): Observable<ContainerDTO[]> {
    return this.http.get<ContainerDTO[]>(urlGetContainers);
  }

  getDataByContainer(idCarga: number[], containers: string): Observable<DWContainer[]> {
    const idsCarga = idCarga.join(',');
    return this.http.get<DWContainer[]>(`${urlGetDataByContainer}?idsCarga=${idsCarga}&containers=${containers}`);
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

  getFechasListasPrecios(): Observable<Date[]> {
    return this.http.get<Date[]>(urlGetFechas);
  }

  getCajasCarga(idCarga: number[], containerList: string): Observable<DWCajaCarga[]> {
    return this.http.get<DWCajaCarga[]>(`${urlGetCajasCarga}?idsCarga=${idCarga}&containerList=${containerList}`);
  }

  insertarListaPrecios(precios: ConfPrecios[]): Observable<void> {
    return this.http.post<void>(urlInsertarPrecios, precios);
  }

  deleteFechaPrecio(fechas: string[]): Observable<void> {
    const httpOptions = { body: fechas };
    return this.http.delete<void>(urlDeleteFechaPrecios, httpOptions);
  }
  
  //#region ConfProductos
  getNombreProducto(codigo: string): Observable<string[]> {
    return this.http.get<string[]>(`${urlGetNombreProductoAsync}?codigo=${codigo}`);
  }

  getConfProductos(): Observable<ConfProducto[]> {
    return this.http.get<ConfProducto[]>(`${urlGetConfProductos}?esKosher=true`);
  }

  insertConfProductos(productos: ConfProducto[]): Observable<void> {
    return this.http.post<void>(urlInsertConfProductos, productos);
  }

  updateConfProductos(productos: ConfProducto[]): Observable<void> {
    return this.http.put<void>(urlUpdateConfProductos, productos);
  }

  deleteConfPrecios(codigosProducto: string[]): Observable<void> {
    const httpOptions = { body: codigosProducto };
    return this.http.delete<void>(urlDeleteConfProductos, httpOptions);
  }
  //#endregion
}
