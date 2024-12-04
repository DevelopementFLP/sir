import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from 'src/app/09_SIR.Dispositivos.Apps/Interfaces/response-API';
import { 
  urlCrearPresentacionDeEnvaseFichaTecnica, 
  urlEditarPresentacionDeEnvaseFichaTecnica, 
  urlEliminarPresentacionDeEnvaseFichaTecnica, 
  urlGetListaDePresentacionDeEnvaseFichaTecnica 
} from 'src/settings';
import { FtPresentacionDeEnvaseDTO } from '../../../interface/MantenimientoFichaTecnicaInterface/PresentacionDeEnvase/FtPresentacionDeEnvaseDTO';

@Injectable({
  providedIn: 'root'
})
export class FtPresentacionDeEnvaseService {

  constructor(private http: HttpClient) { }

  public GetListaDePresentacionesDeEnvaseFichaTecnica(): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${urlGetListaDePresentacionDeEnvaseFichaTecnica}`);
  }

  public CrearPresentacionDeEnvase(modelo: FtPresentacionDeEnvaseDTO): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${urlCrearPresentacionDeEnvaseFichaTecnica}`, modelo);
  }

  public EditarPresentacionDeEnvase(modelo: FtPresentacionDeEnvaseDTO): Observable<ApiResponse> {
    return this.http.put<ApiResponse>(`${urlEditarPresentacionDeEnvaseFichaTecnica}`, modelo);
  }

  public EliminarPresentacionDeEnvase(id: number): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(`${urlEliminarPresentacionDeEnvaseFichaTecnica}/${id}`);
  }
}
