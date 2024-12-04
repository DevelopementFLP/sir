import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from 'src/app/09_SIR.Dispositivos.Apps/Interfaces/response-API';
import { 
  urlCrearPhFichaTecnica, 
  urlEditarPhFichaTecnica, 
  urlEliminarPhFichaTecnica, 
  urlGetListaDePhFichaTecnica 
} from 'src/settings';
import { FtPhDTO } from '../../../interface/MantenimientoFichaTecnicaInterface/Ph/FtPhDTO';

@Injectable({
  providedIn: 'root'
})
export class FtPhService {

  constructor(private http: HttpClient) { }

  public GetListaDePhFichaTecnica(): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${urlGetListaDePhFichaTecnica}`);
  }

  public CrearPh(modelo: FtPhDTO): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${urlCrearPhFichaTecnica}`, modelo);
  }

  public EditarPh(modelo: FtPhDTO): Observable<ApiResponse> {
    return this.http.put<ApiResponse>(`${urlEditarPhFichaTecnica}`, modelo);
  }

  public EliminarPh(id: number): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(`${urlEliminarPhFichaTecnica}/${id}`);
  }
}
