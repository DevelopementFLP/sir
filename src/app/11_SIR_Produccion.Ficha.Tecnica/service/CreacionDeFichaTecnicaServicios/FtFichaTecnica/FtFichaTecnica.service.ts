import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse } from 'src/app/09_SIR.Dispositivos.Apps/Interfaces/response-API';
import { FtFichaTecnicaDTO } from 'src/app/11_SIR_Produccion.Ficha.Tecnica/interface/CreacionDeFichaTecnicaInterface/FtFichaTecnicaDTO';
import { urlBuscarFichaTecnica, urlCrearFichaTecnica } from 'src/settings';

@Injectable({
  providedIn: 'root'
})
export class FtFichaTecnicaService {

  constructor(
    private http: HttpClient
  ) { }

  public CrearFichaTecnica(modelo: FtFichaTecnicaDTO): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${urlCrearFichaTecnica}`, modelo);
  }

  public BuscarFichaTecnica(codigoDeProducto: string): Observable<ApiResponse> {
    let params = new HttpParams()
    .set('codigoDeProducto', codigoDeProducto)
    return this.http.get<ApiResponse>(`${urlBuscarFichaTecnica}`, { params });
  }
  
}
