import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from 'src/app/09_SIR.Dispositivos.Apps/Interfaces/response-API';
import { 
  urlCrearTipoDeUsoFichaTecnica, 
  urlEditarTipoDeUsoFichaTecnica, 
  urlEliminarTipoDeUsoFichaTecnica, 
  urlGetListaDeTiposDeUsoFichaTecnica 
} from 'src/settings';
import { FtTipoDeUsoDTO } from '../../../interface/MantenimientoFichaTecnicaInterface/TipoDeUso/FtTipoDeUsoDTO';

@Injectable({
  providedIn: 'root'
})
export class FtTipoDeUsoService {

  constructor(private http: HttpClient) { }

  public GetListaDeTiposDeUsoFichaTecnica(): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${urlGetListaDeTiposDeUsoFichaTecnica}`);
  }

  public CrearTipoDeUso(modelo: FtTipoDeUsoDTO): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${urlCrearTipoDeUsoFichaTecnica}`, modelo);
  }

  public EditarTipoDeUso(modelo: FtTipoDeUsoDTO): Observable<ApiResponse> {
    return this.http.put<ApiResponse>(`${urlEditarTipoDeUsoFichaTecnica}`, modelo);
  }

  public EliminarTipoDeUso(id: number): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(`${urlEliminarTipoDeUsoFichaTecnica}/${id}`);
  }

}
