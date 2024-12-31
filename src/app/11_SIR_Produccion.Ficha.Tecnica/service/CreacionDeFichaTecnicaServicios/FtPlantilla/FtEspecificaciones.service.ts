import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse } from 'src/app/09_SIR.Dispositivos.Apps/Interfaces/response-API';
import { FtEspecificacionesPlantillaDTO } from 'src/app/11_SIR_Produccion.Ficha.Tecnica/interface/CreacionDeFichaTecnicaInterface/FtEspecificacionesDTO';
import { urlCrearPlantillaEspecificacionesFichaTecnica, urlEditarPlantillaDeEspecificaciones, urlEliminarEspecificaciones, urlGetResponseEspecificacionesPlantilla, urlListaEspecificacionesPlantilla } from 'src/settings';

@Injectable({
  providedIn: 'root'
})
export class FtEspecificacionesService {

  constructor(
    private http: HttpClient
  ) { }

  public GetListaDeEspecificaciones(): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${urlListaEspecificacionesPlantilla}`);
  }

  public CrearPlantillaEspecificaiones(modelo: FtEspecificacionesPlantillaDTO): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${urlCrearPlantillaEspecificacionesFichaTecnica}`, modelo);
  }

  public EditarCamposDeEspecificaciones(modelo: FtEspecificacionesPlantillaDTO): Observable<ApiResponse> {
    return this.http.put<ApiResponse>(`${urlEditarPlantillaDeEspecificaciones}`, modelo);
  }

  public GetCamposDeEspecificaciones(idPlantilla: number): Observable<ApiResponse> {
    let params = new HttpParams()
    .set('idPlantilla', idPlantilla)
    return this.http.get<ApiResponse>(`${urlGetResponseEspecificacionesPlantilla}`, { params });
  }

  public EliminarEspecificaciones(idPlantilla: number): Observable<ApiResponse> {
    const params = new HttpParams().set('idPlantilla', idPlantilla.toString());
    return this.http.delete<ApiResponse>(`${urlEliminarEspecificaciones}`, { params });
  }

}
