import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { urlInsertarLecturaDeAbasto, urlGetListaDeLecturas, urlGetVistaDeLecturasAbasto } from 'src/settings';
import { ApiResponse } from 'src/app/09_SIR.Dispositivos.Apps/Interfaces/response-API';

@Injectable({
  providedIn: 'root'
})
export class AbastoService {

  constructor(private http:HttpClient) { }

  GetLecturasDeAbasto():Observable<ApiResponse>{
    return this.http.get<ApiResponse>(`${urlGetListaDeLecturas}`)
  }

  createLecturaDeMediaAbasto(idMedia: string, operacion: string): Observable<ApiResponse> {
    let params = new HttpParams()
      .set('lecturaDeAbasto', idMedia)
      .set('operacion', operacion);
    
    return this.http.get<ApiResponse>(`${urlInsertarLecturaDeAbasto}`, { params });
  }

  createLecturaDeMediaAbastoManual(idMedia: string, operacion: string, fechaDeFaena: string, peso: number): Observable<ApiResponse> {
    let params = new HttpParams()
      .set('lecturaDeAbasto', idMedia)
      .set('operacion', operacion)
      .set('fechaDeFaena', fechaDeFaena)
      .set('peso', peso.toString());
    
    return this.http.get<ApiResponse>(`${urlInsertarLecturaDeAbasto}`, { params });
  }

  GetVistaLecturasDeAbasto(fechaDelDia: string):Observable<ApiResponse>{
    return this.http.get<ApiResponse>(`${urlGetVistaDeLecturasAbasto}=${fechaDelDia}`)
  }
}
