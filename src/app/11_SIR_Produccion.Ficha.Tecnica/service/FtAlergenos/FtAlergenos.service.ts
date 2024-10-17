import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from 'src/app/09_SIR.Dispositivos.Apps/Interfaces/response-API';
import { 
  urlCrearAlergenoFichaTecnica, 
  urlEditarAlergenoFichaTecnica, 
  urlEliminarAlergenoFichaTecnica, 
  urlGetListaDeAlergenosFichaTecnica 
} from 'src/settings';
import { FtAlergenosDTO } from '../../interface/Alergenos/FtAlergenosDTO';

@Injectable({
  providedIn: 'root'
})
export class FtAlergenosService {

  constructor(private http: HttpClient) { }

  public GetListaDeAlergenosFichaTecnica(): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${urlGetListaDeAlergenosFichaTecnica}`);
  }

  public CrearAlergeno(modelo: FtAlergenosDTO): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${urlCrearAlergenoFichaTecnica}`, modelo);
  }

  public EditarAlergeno(modelo: FtAlergenosDTO): Observable<ApiResponse> {
    return this.http.put<ApiResponse>(`${urlEditarAlergenoFichaTecnica}`, modelo);
  }

  public EliminarAlergeno(id: number): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(`${urlEliminarAlergenoFichaTecnica}/${id}`);
  }
}
