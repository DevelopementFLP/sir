import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from 'src/app/09_SIR.Dispositivos.Apps/Interfaces/response-API';
import { urlCrearMarcaFichaTecnica, urlEditarMarcaFichaTecnica, urlEliminarMarcaFichaTecnica, urlGetListaDeMarcasFichaTecnica } from 'src/settings';
import { FtMarcaDTO } from '../../interface/Marcas/FtMarcaDTO';

@Injectable({
  providedIn: 'root'
})
export class FtMarcaServiceService {

  constructor(
    private http: HttpClient
  ) { }

  public GetListaDeMarcasFichaTecnica():Observable<ApiResponse>{
    return this.http.get<ApiResponse>(`${urlGetListaDeMarcasFichaTecnica}`)
  }

  public CrearMarca(modelo: FtMarcaDTO): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${urlCrearMarcaFichaTecnica}`, modelo);
  }

  public EditarMarca(modelo: FtMarcaDTO): Observable<ApiResponse> {
    return this.http.put<ApiResponse>(`${urlEditarMarcaFichaTecnica}`, modelo);
  }

  public EliminarMarca(id: number): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(`${urlEliminarMarcaFichaTecnica}/${id}`);
  }

}
