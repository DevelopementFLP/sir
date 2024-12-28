import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse } from 'src/app/09_SIR.Dispositivos.Apps/Interfaces/response-API';
import { FtAspectosGeneralesPlantillaDTO } from 'src/app/11_SIR_Produccion.Ficha.Tecnica/interface/CreacionDeFichaTecnicaInterface/FtAspectosGeneralesDTO';
import { urlBuscarPlantillaDeAspectosGenerales, urlCrearPlantillaAspectosGeneralesFichaTecnica, urlEditarAspectosGeneralesPlantilla, urlGetResponseAspectosGeneralesPlantilla, urlListaAspectosGeneralesPlantilla } from 'src/settings';

@Injectable({
  providedIn: 'root'
})
export class FtAspectosGeneralesService {

  constructor(
    private http: HttpClient
  ) { }
  

  public GetListaAspectosGenerales(): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${urlListaAspectosGeneralesPlantilla}`);
  }

  public BuscarPlantillaDeAspectosGenerales(descripcionDePlantilla: string): Observable<ApiResponse> {
    let params = new HttpParams()
    .set('descripcionDePlantilla', descripcionDePlantilla)
    return this.http.get<ApiResponse>(`${urlBuscarPlantillaDeAspectosGenerales}`, { params });
  }

  public CrearPlantillaAspectosGenerales(modelo: FtAspectosGeneralesPlantillaDTO): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${urlCrearPlantillaAspectosGeneralesFichaTecnica}`, modelo);
  }

  public EditarCamposDeAspectosGenerales(modelo: FtAspectosGeneralesPlantillaDTO): Observable<ApiResponse> {
    return this.http.put<ApiResponse>(`${urlEditarAspectosGeneralesPlantilla}`, modelo);
  }

  public GetCamposDeAspectosGenerales(idPlantilla: number): Observable<ApiResponse> {
    let params = new HttpParams()
    .set('idPlantilla', idPlantilla)
    return this.http.get<ApiResponse>(`${urlGetResponseAspectosGeneralesPlantilla}`, { params });
  }



}
