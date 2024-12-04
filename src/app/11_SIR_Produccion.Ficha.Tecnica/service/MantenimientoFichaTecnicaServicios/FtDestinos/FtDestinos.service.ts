import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse } from 'src/app/09_SIR.Dispositivos.Apps/Interfaces/response-API';
import { FtDestinoDTO } from 'src/app/11_SIR_Produccion.Ficha.Tecnica/interface/MantenimientoFichaTecnicaInterface/Destinos/FtDestinoDTO';
import { urlCrearDestinoFichaTecnica, urlEditarDestinoFichaTecnica, urlEliminarDestinoFichaTecnica, urlGetListaDeDestinoFichaTecnica } from 'src/settings';

@Injectable({
  providedIn: 'root'
})
export class FtDestinosService {

  constructor(
    private http: HttpClient
  ) { }

  public GetListaDeDestinosFichaTecnica(): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${urlGetListaDeDestinoFichaTecnica}`);
  }

  public CrearDestinoFichaTecnica(modelo: FtDestinoDTO): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${urlCrearDestinoFichaTecnica}`, modelo);
  }

  public EditarDestinoFichaTecnica(modelo: FtDestinoDTO): Observable<ApiResponse> {
    return this.http.put<ApiResponse>(`${urlEditarDestinoFichaTecnica}`, modelo);
  }

  public EliminarDestinoFichaTecnica(id: number): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(`${urlEliminarDestinoFichaTecnica}/${id}`);
  }

}
