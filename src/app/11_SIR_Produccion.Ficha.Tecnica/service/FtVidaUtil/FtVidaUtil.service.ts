import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from 'src/app/09_SIR.Dispositivos.Apps/Interfaces/response-API';
import { 
  urlCrearVidaUtilFichaTecnica, 
  urlEditarVidaUtilFichaTecnica, 
  urlEliminarVidaUtilFichaTecnica, 
  urlGetListaDeVidaUtilFichaTecnica 
} from 'src/settings';
import { FtVidaUtilDTO } from '../../interface/VidaUtil/FtVidaUtilDTO';

@Injectable({
  providedIn: 'root'
})
export class FtVidaUtilService {

  constructor(private http: HttpClient) { }

  public GetListaDeVidaUtilFichaTecnica(): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${urlGetListaDeVidaUtilFichaTecnica}`);
  }

  public CrearVidaUtil(modelo: FtVidaUtilDTO): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${urlCrearVidaUtilFichaTecnica}`, modelo);
  }

  public EditarVidaUtil(modelo: FtVidaUtilDTO): Observable<ApiResponse> {
    return this.http.put<ApiResponse>(`${urlEditarVidaUtilFichaTecnica}`, modelo);
  }

  public EliminarVidaUtil(id: number): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(`${urlEliminarVidaUtilFichaTecnica}/${id}`);
  }
}
