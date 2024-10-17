import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from 'src/app/09_SIR.Dispositivos.Apps/Interfaces/response-API';
import { 
  urlCrearOlorFichaTecnica, 
  urlEditarOlorFichaTecnica, 
  urlEliminarOlorFichaTecnica, 
  urlGetListaDeOloresFichaTecnica 
} from 'src/settings';
import { FtOlorDTO } from '../../../interface/MantenimientoFichaTecnicaInterface/Olor/FtOlorDTO';

@Injectable({
  providedIn: 'root'
})
export class FtOlorService {

  constructor(private http: HttpClient) { }

  public GetListaDeOloresFichaTecnica(): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${urlGetListaDeOloresFichaTecnica}`);
  }

  public CrearOlor(modelo: FtOlorDTO): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${urlCrearOlorFichaTecnica}`, modelo);
  }

  public EditarOlor(modelo: FtOlorDTO): Observable<ApiResponse> {
    return this.http.put<ApiResponse>(`${urlEditarOlorFichaTecnica}`, modelo);
  }

  public EliminarOlor(id: number): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(`${urlEliminarOlorFichaTecnica}/${id}`);
  }

}
