
import { HttpClient, HttpParams } from '@angular/common/http';

import { HttpClient } from '@angular/common/http';

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse } from 'src/app/09_SIR.Dispositivos.Apps/Interfaces/response-API';
import { FtEspecificacionesPlantillaDTO } from 'src/app/11_SIR_Produccion.Ficha.Tecnica/interface/CreacionDeFichaTecnicaInterface/FtEspecificacionesDTO';

import { urlBuscarPlantillaDeEspecificaciones, urlCrearPlantillaEspecificacionesFichaTecnica, urlEditarPlantillaDeEspecificaciones, urlGetResponseEspecificacionesPlantilla, urlListaEspecificacionesPlantilla } from 'src/settings';

import { urlCrearPlantillaEspecificacionesFichaTecnica } from 'src/settings';


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


  public BuscarPlantillaDeEspecificaciones(nombreDePlantilla: string): Observable<ApiResponse> {
    let params = new HttpParams()
    .set('nombreDePlantilla', nombreDePlantilla)
    return this.http.get<ApiResponse>(`${urlBuscarPlantillaDeEspecificaciones}`, { params });
  }

  public EditarCamposDeEspecificaciones(modelo: FtEspecificacionesPlantillaDTO): Observable<ApiResponse> {
    return this.http.put<ApiResponse>(`${urlEditarPlantillaDeEspecificaciones}`, modelo);
  }

  public GetCamposDeEspecificaciones(idPlantilla: number): Observable<ApiResponse> {
    let params = new HttpParams()
    .set('idPlantilla', idPlantilla)
    return this.http.get<ApiResponse>(`${urlGetResponseEspecificacionesPlantilla}`, { params });
  }


}
