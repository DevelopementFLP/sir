import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from 'src/app/09_SIR.Dispositivos.Apps/Interfaces/response-API';
import { 
  urlCrearColorFichaTecnica, 
  urlEditarColorFichaTecnica, 
  urlEliminarColorFichaTecnica, 
  urlGetListaDeColoresFichaTecnica 
} from 'src/settings';
import { FtColorDTO } from '../../interface/Colores/FtColorDTO';

@Injectable({
  providedIn: 'root'
})
export class FtColorService {

  constructor(
    private http: HttpClient
  ) { }

  public GetListaDeColoresFichaTecnica(): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${urlGetListaDeColoresFichaTecnica}`);
  }

  public CrearColor(modelo: FtColorDTO): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${urlCrearColorFichaTecnica}`, modelo);
  }

  public EditarColor(modelo: FtColorDTO): Observable<ApiResponse> {
    return this.http.put<ApiResponse>(`${urlEditarColorFichaTecnica}`, modelo);
  }

  public EliminarColor(id: number): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(`${urlEliminarColorFichaTecnica}/${id}`);
  }

}
