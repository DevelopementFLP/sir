import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse } from 'src/app/09_SIR.Dispositivos.Apps/Interfaces/response-API';
import { FtProductoDTO } from 'src/app/11_SIR_Produccion.Ficha.Tecnica/interface/CreacionDeFichaTecnicaInterface/FtProductoDTO';
import { urlCrearProductosFichaTecnica, urlEditarProductosFichaTecnica, urlEliminarProductosFichaTecnica, urlGetProductoFiltradoFichaTecnica } from 'src/settings';

@Injectable({
  providedIn: 'root'
})
export class FtProductoService {

  constructor(
    private http: HttpClient
  ) { }

  // Método para crear un producto
  public CrearProducto(modelo: FtProductoDTO): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${urlCrearProductosFichaTecnica}`, modelo);
  }

  public GetProductoFiltradoFichaTecnica(codigoProducto: string): Observable<ApiResponse> {
    let params = new HttpParams()
    .set('codigoProducto', codigoProducto)
    return this.http.get<ApiResponse>(`${urlGetProductoFiltradoFichaTecnica}`, { params });
  }

  public EditarProducto(modelo: FtProductoDTO): Observable<ApiResponse> {
    return this.http.put<ApiResponse>(`${urlEditarProductosFichaTecnica}`, modelo);
  }

  public EliminarProducto(idProducto: number): Observable<ApiResponse> {
    let params = new HttpParams()
    .set('idProducto', idProducto)
    return this.http.delete<ApiResponse>(`${urlEliminarProductosFichaTecnica}`, {params});
  }

}
