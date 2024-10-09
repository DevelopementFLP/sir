import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from 'src/app/09_SIR.Dispositivos.Apps/Interfaces/response-API';
import { 
  urlCrearTipoAlimentacionFichaTecnica, 
  urlEditarTipoAlimentacionFichaTecnica, 
  urlEliminarTipoAlimentacionFichaTecnica, 
  urlGetListaDeTipoAlimentacionFichaTecnica 
} from 'src/settings';
import { FtTipoDeAlimentacionDTO } from '../../interface/Alimentacion/FtTipoDeAlimentacionDTO';

@Injectable({
  providedIn: 'root'
})
export class FtTipoDeAlimentacionService {

  constructor(private http: HttpClient) { }

  public GetListaDeTiposDeAlimentacionFichaTecnica(): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${urlGetListaDeTipoAlimentacionFichaTecnica}`);
  }

  public CrearTipoDeAlimentacion(modelo: FtTipoDeAlimentacionDTO): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${urlCrearTipoAlimentacionFichaTecnica}`, modelo);
  }

  public EditarTipoDeAlimentacion(modelo: FtTipoDeAlimentacionDTO): Observable<ApiResponse> {
    return this.http.put<ApiResponse>(`${urlEditarTipoAlimentacionFichaTecnica}`, modelo);
  }

  public EliminarTipoDeAlimentacion(id: number): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(`${urlEliminarTipoAlimentacionFichaTecnica}/${id}`);
  }
}
