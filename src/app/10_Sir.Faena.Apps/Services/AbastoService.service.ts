import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { urlInsertarLecturaDeAbasto, urlGetListaDeLecturas, urlGetVistaDeLecturasAbasto, urlGetLecturaFiltrada, urlDeleteLecturaDeAbasto } from 'src/settings';
import { ApiResponse } from 'src/app/09_SIR.Dispositivos.Apps/Interfaces/response-API';

@Injectable({
  providedIn: 'root'
})
export class AbastoService {

  constructor(private http:HttpClient) { }

  public GetLecturasDeAbasto():Observable<ApiResponse>{
    return this.http.get<ApiResponse>(`${urlGetListaDeLecturas}`)
  }

  public GetLecturaDeAbastoFiltrada(codigoQr: string):Observable<ApiResponse>{
    let params = new HttpParams()
    .set('codigoQr', codigoQr)
    return this.http.get<ApiResponse>(`${urlGetLecturaFiltrada}`, {params})
  }

  public createLecturaDeMediaAbasto(idMedia: string, operacion: string, usuarioLogueado: string): Observable<ApiResponse> {
    let params = new HttpParams()
      .set('lecturaDeAbasto', idMedia)
      .set('operacion', operacion)
      .set('usuarioLogueado', usuarioLogueado);    
      return this.http.get<ApiResponse>(`${urlInsertarLecturaDeAbasto}`, { params });
  }

  public createLecturaDeMediaAbastoManual(idMedia: string, operacion: string, usuarioLogueado: string , fechaDeFaena: string): Observable<ApiResponse> {

  public createLecturaDeMediaAbastoManual(idMedia: string, operacion: string, usuarioLogueado: string , fechaDeFaena: string, peso: number): Observable<ApiResponse> {

    let params = new HttpParams()
      .set('lecturaDeAbasto', idMedia)
      .set('operacion', operacion)
      .set('usuarioLogueado', usuarioLogueado)

      .set('fechaDeFaena', fechaDeFaena)     

      .set('fechaDeFaena', fechaDeFaena)
      .set('peso', peso);      

      return this.http.get<ApiResponse>(`${urlInsertarLecturaDeAbasto}`, { params });
  }

  public GetListarStockAbasto():Observable<ApiResponse>{
    return this.http.get<ApiResponse>(`${urlGetVistaDeLecturasAbasto}`)
  }

  public DeleteLecturaDeAbasto(idAnimal: string): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(`${urlDeleteLecturaDeAbasto}?idAnimal=${idAnimal}`);
  }
}
