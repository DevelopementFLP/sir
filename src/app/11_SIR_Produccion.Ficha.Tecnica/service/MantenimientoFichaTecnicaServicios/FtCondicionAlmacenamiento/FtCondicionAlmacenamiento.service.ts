import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FtCondicionDeAlmacenamientoDTO } from '../../../interface/MantenimientoFichaTecnicaInterface/CondicionDeAlmacenamiento/FtCondicionAlmacenamientoDTO';
import { ApiResponse } from 'src/app/09_SIR.Dispositivos.Apps/Interfaces/response-API';
import { urlCrearCondicionFichaTecnica, urlEditarCondicionFichaTecnica, urlEliminarCondicionFichaTecnica, urlGetListaDeCondicionFichaTecnica } from 'src/settings';



@Injectable({
  providedIn: 'root'
})
export class FtCondicionAlmacenamientoService {

  constructor(
    private http: HttpClient
  ) { }

  public GetListaDeCondicionesFichaTecnica():Observable<ApiResponse>{
    return this.http.get<ApiResponse>(`${urlGetListaDeCondicionFichaTecnica}`)
  }

  public CrearCondicion(modelo: FtCondicionDeAlmacenamientoDTO): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${urlCrearCondicionFichaTecnica}`, modelo);
  }

  public EditarCondicion(modelo: FtCondicionDeAlmacenamientoDTO): Observable<ApiResponse> {
    return this.http.put<ApiResponse>(`${urlEditarCondicionFichaTecnica}`, modelo);
  }

  public EliminarCondicion(id: number): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(`${urlEliminarCondicionFichaTecnica}/${id}`);
  }

}
