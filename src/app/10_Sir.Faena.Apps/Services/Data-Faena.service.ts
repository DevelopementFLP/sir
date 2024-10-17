import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { urlGetReporteDeMediasProducto, urlGetReporteDeMediasProveedor} from 'src/settings';
import { ApiResponse } from 'src/app/09_SIR.Dispositivos.Apps/Interfaces/response-API';

@Injectable({
  providedIn: 'root'
})
export class DataFaenaService {

  constructor(
    private http:HttpClient
  ) { }

  public GetReporteDeMediasProducto(fechaDesde: string, fechahasta: string, horaDesde: number, horaHasta: number ):Observable<ApiResponse>{
    let params = new HttpParams()
    .set('fechaDesde', fechaDesde)
    .set('fechaHasta', fechahasta)
    .set('horaDesde', horaDesde)
    .set('horaHasta', horaHasta);
    return this.http.get<ApiResponse>(`${urlGetReporteDeMediasProducto}`, {params})
  }

  public GetReporteDeMediasProveedor(fechaDesde: string, fechahasta: string, horaDesde: number, horaHasta: number):Observable<ApiResponse>{
    let params = new HttpParams()
    .set('fechaDesde', fechaDesde)
    .set('fechaHasta', fechahasta)
    .set('horaDesde', horaDesde)
    .set('horaHasta', horaHasta);
    return this.http.get<ApiResponse>(`${urlGetReporteDeMediasProveedor}`, {params})
  }

}
