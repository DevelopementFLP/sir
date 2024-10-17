import { HttpClient,  HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse } from 'src/app/09_SIR.Dispositivos.Apps/Interfaces/response-API';
import { urlGetResponseAspectosGeneralesPlantilla, urlGetResponseEspecificacionesPlantilla } from 'src/settings';

@Injectable({
  providedIn: 'root'
})
export class FtResponsePlantillasService {

  constructor(
    private http: HttpClient
  ) { }

  public GetReponseAspectosGeneralesPlantilla(idPlantilla: number): Observable<ApiResponse> {
    let params = new HttpParams()
    .set('idPlantilla', idPlantilla)
    return this.http.get<ApiResponse>(`${urlGetResponseAspectosGeneralesPlantilla}`, { params });
  }

  public GetReponseEspecificacionesPlantilla(idPlantilla: number): Observable<ApiResponse> {
    let params = new HttpParams()
    .set('idPlantilla', idPlantilla)
    return this.http.get<ApiResponse>(`${urlGetResponseEspecificacionesPlantilla}`, { params });
  }

}
