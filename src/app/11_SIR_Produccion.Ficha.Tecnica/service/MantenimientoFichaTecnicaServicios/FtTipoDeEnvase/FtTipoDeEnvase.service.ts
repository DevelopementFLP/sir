import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from 'src/app/09_SIR.Dispositivos.Apps/Interfaces/response-API';
import { 
  urlCrearTipoDeEnvaseFichaTecnica, 
  urlEditarTipoDeEnvaseFichaTecnica, 
  urlEliminarTipoDeEnvaseFichaTecnica, 
  urlGetListaDeTipoDeEnvaseFichaTecnica 
} from 'src/settings';
import { FtTipoDeEnvaseDTO } from '../../../interface/MantenimientoFichaTecnicaInterface/TipoDeEnvase/FtTipoDeEnvaseDTO';

@Injectable({
  providedIn: 'root'
})
export class FtTipoDeEnvaseService {

  constructor(private http: HttpClient) { }

  public GetListaDeTiposDeEnvaseFichaTecnica(): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${urlGetListaDeTipoDeEnvaseFichaTecnica}`);
  }

  public CrearTipoDeEnvase(modelo: FtTipoDeEnvaseDTO): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${urlCrearTipoDeEnvaseFichaTecnica}`, modelo);
  }

  public EditarTipoDeEnvase(modelo: FtTipoDeEnvaseDTO): Observable<ApiResponse> {
    return this.http.put<ApiResponse>(`${urlEditarTipoDeEnvaseFichaTecnica}`, modelo);
  }

  public EliminarTipoDeEnvase(id: number): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(`${urlEliminarTipoDeEnvaseFichaTecnica}/${id}`);
  }
}
