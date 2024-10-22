import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse } from 'src/app/09_SIR.Dispositivos.Apps/Interfaces/response-API';
import { FtAspectosGeneralesPlantillaDTO } from 'src/app/11_SIR_Produccion.Ficha.Tecnica/interface/CreacionDeFichaTecnicaInterface/FtAspectosGeneralesDTO';
import { urlCrearPlantillaAspectosGeneralesFichaTecnica, urlGetResponseAspectosGeneralesPlantilla, urlGetResponseEspecificacionesPlantilla, urlListaAspectosGeneralesPlantilla, urlListaEspecificacionesPlantilla } from 'src/settings';

@Injectable({
  providedIn: 'root'
})
export class FtAspectosGeneralesService {

  constructor(
    private http: HttpClient
  ) { }

  public CrearPlantillaAspectosGenerales(modelo: FtAspectosGeneralesPlantillaDTO): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${urlCrearPlantillaAspectosGeneralesFichaTecnica}`, modelo);
  }

  public GetListaAspectosGenerales(): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${urlListaAspectosGeneralesPlantilla}`);
  }

  public GetListaDeEspecificaciones(): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${urlListaEspecificacionesPlantilla}`);
  }

  public GetCamposDeAspectosGenerales(idPlantilla: number): Observable<ApiResponse> {
    let params = new HttpParams()
    .set('idPlantilla', idPlantilla)
    return this.http.get<ApiResponse>(`${urlGetResponseAspectosGeneralesPlantilla}`, { params });
  }

  public GetCamposDeEspecificaciones(idPlantilla: number): Observable<ApiResponse> {
    let params = new HttpParams()
    .set('idPlantilla', idPlantilla)
    return this.http.get<ApiResponse>(`${urlGetResponseEspecificacionesPlantilla}`, { params });
  }

}
