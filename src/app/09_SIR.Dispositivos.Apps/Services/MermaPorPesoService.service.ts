import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { urlGetMermaPorPeso } from 'src/settings';
import { ApiResponse } from '../Interfaces/response-API';


@Injectable({
  providedIn: 'root'
})
export class MermaPorPesoService {

  constructor(private http:HttpClient) { }

  getListaMermaPorPeso(fechaDesde: string, fechaHasta: string):Observable<ApiResponse>{
    return this.http.get<ApiResponse>(`${urlGetMermaPorPeso}?FechaDesde=${fechaDesde}&FechaHasta=${fechaHasta}`)
  }

}
